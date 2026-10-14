


export interface User {
    id: string;
    displayName: string;
    email: string;
    token: string;
    image_URL?: string;
}

export type LoginCreds = {
    Email: string;
    Password: string;
};

export type RegisterCreds = {
    Email: string;
    DisplayName: string;
    Password: string;
    gender: string;
    city: string;
    country:string;
};
