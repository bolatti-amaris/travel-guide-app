import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Place } from '@/core/domain/entities/Place';
import { GetPlacesByCityKey } from '@/core/domain/usecases/GetPlacesByCityKey';
import { PlaceRepository } from '@/core/domain/repositories/PlaceRepository';

interface PlacesState {
  places: Place[];
  isLoading: boolean;
  error: string | null;
  fetchPlaces: (key: string) => Promise<void>;
  reset: () => void;
}

export const createPlacesStore = (repository: PlaceRepository) =>
  create<PlacesState>()(
    devtools(
      (set) => {
        const getPlacesByCityKey = new GetPlacesByCityKey(repository);

        return {
          places: [],
          isLoading: false,
          error: null,

          fetchPlaces: async (key: string) => {
            set({ isLoading: true, error: null }, false, 'places/fetchPlaces');
            try {
              const places = await getPlacesByCityKey.execute(key);
              set(
                { places, isLoading: false },
                false,
                'places/fetchPlacesSuccess',
              );
            } catch (err: any) {
              set(
                {
                  error: err.message || 'Error fetching places',
                  isLoading: false,
                },
                false,
                'places/fetchPlacesError',
              );
            }
          },

          reset: () => {
            set(
              { places: [], error: null, isLoading: false },
              false,
              'places/reset',
            );
          },
        };
      },
      { name: 'PlacesStore' },
    ),
  );
