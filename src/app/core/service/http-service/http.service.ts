import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {
	constructor(private http: HttpClient) {
	}

	get<T>(url: string): Observable<T> {
		return this.http.get<T>(url);
	}

	getWithResponse<T>(url: string): Observable<any> {
		return this.http.get<T>(url, { observe: 'response' });
	}

	post<T>(url: string, data: any): Observable<T> {
		return this.http.post<T>(url, data);
	}

	put<T>(url: string, data: any): Observable<T> {
		return this.http.put<T>(url, data);
	}

	delete<T>(url: string): Observable<T> {
		return this.http.delete<T>(url);
	}
}