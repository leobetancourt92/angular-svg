import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const SERVER_URL = 'http://ec2-13-58-19-124.us-east-2.compute.amazonaws.com:8080/api/v1';

@Injectable({
  providedIn: 'root'
})

export class DataApiService {
	constructor(private http: HttpClient) {}
	
	getDeviceData(deviceName: string): Observable<any> {
		const url = `${SERVER_URL}/devices/${deviceName}`;
		return this.http.get(url).pipe(map(res => res));
	}

	getUICatalogData(catalogName: string): Observable<any> {
		const url = `${SERVER_URL}/uicatalogs/${catalogName}`;
		return this.http.get(url).pipe(map(res => res));
	}

	getInterfaceData(interfaceName: string): Observable<any> {
		const url = `${SERVER_URL}/intfs/${interfaceName}`;
		return this.http.get(url).pipe(map(res => res));
	}

	getFanData(fanName: string): Observable<any> {
		const url = `${SERVER_URL}/fans/${fanName}`;
		return this.http.get(url).pipe(map(res => res));
	}

	getPowerSupplyData(powerSupplyName: string): Observable<any> {
		const url = `${SERVER_URL}/powersupplys/${powerSupplyName}`;
		return this.http.get(url).pipe(map(res => res));
	}
}