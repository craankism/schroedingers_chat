import type {
    SmtpConfigConfirmedType,
    SmtpConfigType,
    SmtpReturnType,
    SmtpTestAddressType
} from "../types/SmtpConfigType.ts";
import {create} from "zustand/react";
import {useNotificationStore} from "./NotificationStore.ts";
import {smtpApi} from "../services/apiCalls.ts";

type SmtpState = {
    error: string | null;
    smtpConfig: SmtpReturnType | null;
    submitSmtp: (smtpConfig: SmtpConfigType) => Promise<SmtpReturnType | undefined>;
    testSmtp: (testEmail: SmtpTestAddressType) =>  Promise<SmtpReturnType | undefined>;
    confirmSmtp: (smtpConfirmation: SmtpConfigConfirmedType) => Promise<SmtpReturnType | undefined>;
    getSmtp: () => Promise<SmtpReturnType | undefined>;
}

export const useSmtpStore = create<SmtpState>((set) => ({
    error: null,
    smtpConfig: null,

    submitSmtp: async (smtpConfig: SmtpConfigType) => {
        useNotificationStore.getState().startLoading();
        try {
            const data = await smtpApi.submitSmtp(smtpConfig);
            set({smtpConfig: data});
            useNotificationStore.getState().addNotification("Smtp Config successfully sent", "success");
            return data;
        } catch (e) {
            set({error: "Error" + e});
            useNotificationStore.getState().addNotification("Error sending SMTP Config", "error");
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

    testSmtp: async (testEmail: SmtpTestAddressType) => {
        useNotificationStore.getState().startLoading();
        try {
            const data = await smtpApi.testSmtp(testEmail);
            set({smtpConfig: data});
            useNotificationStore.getState().addNotification("Test Mail sent to" + data.testAddress, "success");
            return data;
        } catch (e) {
            set({error: "Error" + e});
            useNotificationStore.getState().addNotification("Error sending Test Mail", "error");
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

    confirmSmtp: async (smtpConfirmation: SmtpConfigConfirmedType) => {
        useNotificationStore.getState().startLoading();
        try {
            const data = await smtpApi.confirmSmtp(smtpConfirmation);
            set({smtpConfig: data});
            useNotificationStore.getState().addNotification("SMTP Config confirmed", "success");
            return data;
        } catch (e) {
            set({error: "Error" + e});
            useNotificationStore.getState().addNotification("Error confirming SMTP Config", "error");
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

    getSmtp: async () => {
        useNotificationStore.getState().startLoading();
        try {
            const data = await smtpApi.getSmtp();
            set({smtpConfig: data});
            return data;
        } catch (e) {
            set({error: "Error" + e});
            useNotificationStore.getState().addNotification("Error fetching SMTP Config", "error");
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    }

}))