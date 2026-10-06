export  interface User{
    id:string;
    displayName:string;
    Email:string;
    Token:string;
    Image_URL ?:string;

}

export type LoginCreds={

    Email:string;
    Password:string;
}


export type RegisterCreds={

    Email:string;
    DisplayName:string;
    Password:string;
}

