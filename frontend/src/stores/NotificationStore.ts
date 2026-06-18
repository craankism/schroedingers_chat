import {create} from 'zustand';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

interface NotificationState {
    notifications: Notification[];
    loadingCount: number;
    addNotification: (message: string, type: NotificationType) => void;
    removeNotification: (id: number) => void;
    startLoading: () => void;
    stopLoading: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    loadingCount: 0,
    addNotification: (message, type) => {
        const id = Date.now();
        set((state) => ({
            notifications: [...state.notifications, {id, message, type}],
        }));
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),


            }));
        }, 3000);
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !==id),
        }));
    },
    startLoading: () => {
        set((state: NotificationState) => ({loadingCount: state.loadingCount +1}))
    },
    stopLoading: () => {
        set((state: NotificationState) => ({loadingCount: Math.max(0, state.loadingCount -1)}))
    },
}))