export interface LoginChallengePayload {

    challenge_type: string;
    client_id: string;
    device_token: string;
    expires_in: number;
    grant_type: string;
    password: string;
    scope: string;
    username: string;
}

export interface LoginResponsePayload 
{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    username: string;

    //option 2
    challenge_id: string;
    payload: LoginChallengePayload;
}