import { Client, TravelMode, PlaceData, PlacesNearbyResponseData } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({});

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface Route {
    distance: number;  // in meters
    duration: number;  // in seconds
    steps: {
        distance: number;
        duration: number;
        transportMode: string;
        instructions: string;
    }[];
}

export interface PlaceDetails {
    name: string;
    address: string;
    location: Location;
    rating: number;
    types: string[];
    photos: string[];
    priceLevel: number;
}

interface DirectionsStep {
    distance: { value: number };
    duration: { value: number };
    html_instructions: string;
}

class GoogleMapsService {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('Google Maps API key is required');
        }
    }

    async geocodeAddress(address: string): Promise<Location> {
        try {
            const response = await client.geocode({
                params: {
                    address,
                    key: this.apiKey
                }
            });

            if (response.data.results.length === 0) {
                throw new Error('No results found');
            }

            const result = response.data.results[0];
            return {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                address: result.formatted_address
            };
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw error;
        }
    }

    async getDirections(
        origin: string | Location,
        destination: string | Location,
        mode: TravelMode = TravelMode.driving
    ): Promise<Route> {
        try {
            const response = await client.directions({
                params: {
                    origin: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
                    destination: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
                    mode,
                    key: this.apiKey
                }
            });

            if (response.data.routes.length === 0) {
                throw new Error('No routes found');
            }

            const route = response.data.routes[0].legs[0];
            return {
                distance: route.distance.value,
                duration: route.duration.value,
                steps: route.steps.map((step: DirectionsStep) => ({
                    distance: step.distance.value,
                    duration: step.duration.value,
                    transportMode: mode,
                    instructions: step.html_instructions
                }))
            };
        } catch (error) {
            console.error('Error getting directions:', error);
            throw error;
        }
    }

    async searchNearbyPlaces(
        location: Location,
        radius: number = 5000,
        type?: string
    ): Promise<PlaceDetails[]> {
        try {
            const response = await client.placesNearby({
                params: {
                    location: `${location.lat},${location.lng}`,
                    radius,
                    type,
                    key: this.apiKey
                }
            });

            return (response.data as PlacesNearbyResponseData).results.map(place => ({
                name: place.name || '',
                address: place.vicinity || '',
                location: {
                    lat: place.geometry?.location.lat || 0,
                    lng: place.geometry?.location.lng || 0,
                    address: place.vicinity || ''
                },
                rating: place.rating || 0,
                types: place.types || [],
                photos: place.photos?.map(photo => 
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
                ) || [],
                priceLevel: place.price_level || 0
            }));
        } catch (error) {
            console.error('Error searching nearby places:', error);
            throw error;
        }
    }

    async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
        try {
            const response = await client.placeDetails({
                params: {
                    place_id: placeId,
                    key: this.apiKey
                }
            });

            const place = response.data.result;
            return {
                name: place.name || '',
                address: place.formatted_address || '',
                location: {
                    lat: place.geometry?.location.lat || 0,
                    lng: place.geometry?.location.lng || 0,
                    address: place.formatted_address || ''
                },
                rating: place.rating || 0,
                types: place.types || [],
                photos: place.photos?.map(photo => 
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
                ) || [],
                priceLevel: place.price_level || 0
            };
        } catch (error) {
            console.error('Error getting place details:', error);
            throw error;
        }
    }
}

export const googleMapsService = new GoogleMapsService(); 