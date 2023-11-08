

import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


/** 
*Declaring the api url that will provide data for the client app
*/
const apiUrl = 'https://movie-api-1000.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  /** 
  * Inject the HttpClient module to the constructor params
  * This will provide HttpClient to the entire class, making it available via this.http
  */
  constructor(private http: HttpClient) { }
  
  /**
  * Making the api call for the user registration endpoint
  * @param userDetails object with the details of the user
  * @returns an observable with the created user
  */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

 /**
   * checks if the username and password are correct and gives user a token
   * @param userDetails object with the user's username and password
   * @returns token and user info
   */
    public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
 * fetches all movies from the api
 * @returns array of all movies
 */

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  
/**
 * @description Get a movie by title
 * @name GET /movies/:Title
 * @example
 * Authentication: Bearer token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * {
 *   _id: ObjectID
 *   "Title": "",
 *   "Description": "",
 *   "Genre": ObjectID,
 *   "Director": [ObjectID],
 *   "Actors": [ObjectID],
 *   "ImagePath": "",
 *   "Featured": Boolean,
 * }
 */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

/**
 * fetches the info for one director from the api
 * @param directorName name of the director
 * @returns the director's info
 */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

/**
 * fetches the info for one genre from the api 
 * @param genreName name of the genre
 * @returns the genre's info
 */
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

/**
 * fetches the info for one user from the api
 * @returns user info
 */
getOneUser(): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  return this.http
    .get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
}
/**
 * fetches the user's favorite movie array 
 * @returns user's array of favorite movies by id
 */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }


/**
 * adds a movie to a user's favorite movie array by movie id
 * @param movieId the movie id
 * @returns user object
 */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.Favourites.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token, 
        }),
        responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.Favourites.indexOf(movieId) >= 0;
  }


/**
 * updates the info for a user by username
 * @param updatedUser the new info for the user
 * @returns user object
 */

  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token, 
        }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

/**
 * deletes all info for a user by username
 * @returns 
 */


  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
    }).pipe(
      catchError(this.handleError)
    );
  }

/**
 * deletes a movie from the user's favorite movie array by movie id
 * @param movieId the movie's id
 * @returns user object
 */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.Favourites.indexOf(movieId);
    console.log(index);
    if (index > -1) { //only splice array when item is found
      user.Favourites.splice(index, 1); 
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
        responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**non-typed response extraction*/
  /**
   * 
   * @param res 
   * @returns 
   */

  private extractResponseData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred: ', error.error.message);
    } 
    else if (error.error.errors) {
      return throwError(() => new Error(error.error.erros[0].msg));
    } 
    else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened. Please try again later.'));
  }
}