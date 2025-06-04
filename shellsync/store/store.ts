import { create } from 'zustand';

interface ServerState {}

export const useServerStore = create<ServerState>((set) => ({}));
