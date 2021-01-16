export interface LoginResponsePayload 
{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    username: string;

    //option 2
    challenge_id: string;
    payload: any;
}