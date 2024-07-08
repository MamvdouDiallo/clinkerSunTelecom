import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/services/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // get accessToken(): string {
    //     return 'eyJhbGciOiJIUzI1NiJ9.eyJwcmluY2lwYWwiOiJINHNJQUFBQUFBQUEvNVZTUFc4VFFSQWRINDZDaUFnSlVpSlJoSWJRb2JNRUhhNGNjNG1DTG5ia2o0SWdFYTN2eG1hVHZkMWpkeSt4RytRS2loUkJRQ1FrL2tMK0NUVDhBQVFGYldwYVppOU96dEJFYkxXYWVmdmVtemQ3ZWdZelJzT2pnV1pjR0Q4VjJZQkwzNlNheTRIQktOUGNqdnpNb0k3UjVvaU5ITmlsQ3B5ZmtnZWxFRHdlVzdnZDdyRURWaEZNRGlyTjNoNUd0anJVOEZEcHdZU3hyMW1DaDBydis1ZmNrZEw0bDBCQjdUMzJZSFlIRmxrVXFVemFocExCTU9VYTR4MVlLR3FoaXZaZGFTbWlEa3JMbVREVDBGbVVyQ2N3RG1HT1pmYWxJbFdPeHNLdGM3T1o1YUxTUmxzTjRYcktqQ0YzLzB6U3RzNjY2enVia2laNEJhK2hQRXhMZENpNyt3N3FPeDYvcm9TZ3FibVNaclVyRXhYelBuZml4RDllZWYvdCtQTzQ2d0ZRSmcrdWZsUFU3NnpCK011TDMzZnpvRXVSaGVVcDZ3V3NPa3pKeldMQjNOSG9sTDkvMnY1d2N2YjIrVFZTZG9qMS85L0hhbTJTM0tpdWtwUnBadFhVam9qMnNPenVSTDUyTmZuRkZrWitteWVwUVBwUjBtSjhLVkVRMDdobHJjUkYzaGFXV3MwdzJLMDkyZHBzN0c2SHRVNnczbXh0QmNiMTV5M2N6THZ0b041dGJYYWVPZnlOVkRDTGZhVVRKRy96ZVRSdXAzNm9hS05Idjk1OVBiNzNnM1Nld3N3QkV4blNaaFlLVUNOTGVxamZuSjZzekgzOGVaVFBPZm56M2grcmdzZjhOd01BQUE9PSIsInN1YiI6InBsYXRlZm9ybWUiLCJyb2xlcyI6WyJST0xFX0FETUlOX1BMQVRFRk9STUUiLCJST0xFX1NFQ1VSSVRZIl0sImlzcyI6IlNwcmluZyBTZWN1cml0eSBSRVNUIEdyYWlscyBQbHVnaW4iLCJleHAiOjE3MjExMTkzNDgsImlhdCI6MTcxOTgyMzM0OH0.yhbafmd9NIylzxRpToOZ5PPgUYXAVl1D3u0gHnQEojM';
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJwcmluY2lwYWwiOiJINHNJQUFBQUFBQUEvNVZTUFc4VFFSQWRINDZDaUFnSlVpSlJoSWJRb2JNRUhhNGNjNG1DTG5ia2o0SWdFYTN2eG1hVHZkMWpkeSt4RytRS2loUkJRQ1FrL2tMK0NUVDhBQVFGYldwYVppOU96dEJFYkxXYWVmdmVtemQ3ZWdZelJzT2pnV1pjR0Q4VjJZQkwzNlNheTRIQktOUGNqdnpNb0k3UjVvaU5ITmlsQ3B5ZmtnZWxFRHdlVzdnZDdyRURWaEZNRGlyTjNoNUd0anJVOEZEcHdZU3hyMW1DaDBydis1ZmNrZEw0bDBCQjdUMzJZSFlIRmxrVXFVemFocExCTU9VYTR4MVlLR3FoaXZaZGFTbWlEa3JMbVREVDBGbVVyQ2N3RG1HT1pmYWxJbFdPeHNLdGM3T1o1YUxTUmxzTjRYcktqQ0YzLzB6U3RzNjY2enVia2laNEJhK2hQRXhMZENpNyt3N3FPeDYvcm9TZ3FibVNaclVyRXhYelBuZml4RDllZWYvdCtQTzQ2d0ZRSmcrdWZsUFU3NnpCK011TDMzZnpvRXVSaGVVcDZ3V3NPa3pKeldMQjNOSG9sTDkvMnY1d2N2YjIrVFZTZG9qMS85L0hhbTJTM0tpdWtwUnBadFhVam9qMnNPenVSTDUyTmZuRkZrWitteWVwUVBwUjBtSjhLVkVRMDdobHJjUkYzaGFXV3MwdzJLMDkyZHBzN0c2SHRVNnczbXh0QmNiMTV5M2N6THZ0b041dGJYYWVPZnlOVkRDTGZhVVRKRy96ZVRSdXAzNm9hS05Idjk1OVBiNzNnM1Nld3N3QkV4blNaaFlLVUNOTGVxamZuSjZzekgzOGVaVFBPZm56M2grcmdzZjhOd01BQUE9PSIsInN1YiI6InBsYXRlZm9ybWUiLCJyb2xlcyI6WyJST0xFX0FETUlOX1BMQVRFRk9STUUiLCJST0xFX1NFQ1VSSVRZIl0sImlzcyI6IlNwcmluZyBTZWN1cml0eSBSRVNUIEdyYWlscyBQbHVnaW4iLCJleHAiOjE3MjExMTkzNDgsImlhdCI6MTcxOTgyMzM0OH0.yhbafmd9NIylzxRpToOZ5PPgUYXAVl1D3u0gHnQEojM";
                // Set the authenticated flag to true
                this._authenticated = true;
                // Store the user on the user service
                this._userService.user = response.user;
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
