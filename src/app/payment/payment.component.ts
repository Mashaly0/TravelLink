import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { StripeService } from './payment.service';
import { Router } from '@angular/router';
import { LoadingDialogComponent } from '../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class StripeComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;

  stripe!: Stripe;
  private elements!: StripeElements;
  stripeService = inject(StripeService);
  price!: number;
  bookingId!: string;

  constructor() {
    let navigation = this.router.getCurrentNavigation();
    let state = navigation?.extras.state;
    this.price = state!['price'];
    this.bookingId = state!['bookingId'];
  }

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51RrkFWRrVLiB4Kel8Hg35UAHw4l6fvznMX5Qx2gphKYb4yEtY2EZhdlCMY0Hkbla06Se2KPqEU08jyo7TLvjnlrZ00b8nTZWTv') as Stripe;
    this.elements = this.stripe.elements();
    const cardStyle = {
      style: {
        base: {
          color: '#32325d',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#a0aec0',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      }
    };

    const card = this.elements.create('card', cardStyle);
    card.mount(this.cardElement.nativeElement);
    this.card = card;
  }


  card!: StripeCardElement;

  router = inject(Router);

  dialog = inject(MatDialog);

  toastService = inject(ToastrService);


  async pay() {
    const ref = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    })
    const result = await this.stripeService.makePaymentWithCard(this.price, this.card, this.stripe);
    if (result.paymentIntent?.status === 'succeeded') {

      this.stripeService.confirmBookingPayment(this.bookingId, this.price).subscribe(
        {
          next: (value) => {
            ref.close();
            this.toastService.success('Payment successful!', '✅ Success', {
              toastClass: 'ngx-toastr custom-success'
            });

            this.router.navigate(['/'], { replaceUrl: true })
          },
          error: (err) => {
            ref.close();
            this.toastService.error('❌ Payment failed! Try Again Later', '❌ Error', {
              toastClass: 'ngx-toastr custom-error'
            });
          },
        }
      );
    } else {
      ref.close();
      this.toastService.error('❌ Payment failed! Try Again Later', '❌ Error', {
        toastClass: 'ngx-toastr custom-error'
      });
    }
  }
}
