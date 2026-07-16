export type SmtpConfigType = {
    host: string;
    port: number;
    username: string;
    password: string;
    sender: string;
    tlsEnabled: boolean;
}

export type SmtpConfigConfirmedType = {
    isConfirmed: boolean;
}

export type SmtpTestAddressType = {
    testAddress: string;
}

export type SmtpReturnType = {
    smtpId: number;
    host: string;
    port: number;
    username: string;
    sender: string;
    tlsEnabled: boolean;
    isConfirmed: boolean;
    testAddress: string;
}