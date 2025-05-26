export class LoginDataTransfer {
    // @of LoginCredentials
    username: string;
    password: string;
    remember: boolean;

    constructor(username: string, password: string, remember: boolean) {
        this.username = username
        this.password = password
        this.remember = remember
    }

    o(): any{
        return {
            username: this.username,
            password: this.password,
            remember: this.remember
        }
    }
}