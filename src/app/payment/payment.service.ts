import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeService {

    constructor(private http: HttpClient) { }

    async makePaymentWithCard(amount: number, card: StripeCardElement, stripe: Stripe) {

        const response: any = await this.http.post('http://localhost:4242/api/create-payment-intent', {
            amount: amount
        }).toPromise();

        const clientSecret = response.clientSecret;

        const result = await stripe!.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {

                },
            },
        });

        return result;
    }

    confirmBookingPayment(bookingId: string, totalPrice: number): Observable<any> {
        return this.http.post('https://fizo.runasp.net/api/Payment/CreatePayment', {
            'bookingId': bookingId,
            'totalPrice': totalPrice
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}
