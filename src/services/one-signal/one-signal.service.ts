import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CreateOneSignalMessage,
  CreateOneSignalMessageResponse,
} from './interfaces/messages.one-signal.interface';

@Injectable()
export class OneSignalService {
  private readonly oneSignalEndpoint: string;
  private readonly oneSignalApiKey: string;
  private readonly oneSignalAppId: string;

  constructor(private readonly httpService: HttpService) {
    this.oneSignalEndpoint =
      process.env.ONESIGNAL_ENDPOINT || 'https://onesignal.com/api/v1';

    this.oneSignalApiKey = process.env.ONESIGNAL_API_KEY || '';

    this.oneSignalAppId = process.env.ONESIGNAL_APP_ID || '';

    console.log('🔔 OneSignal Service Initialized:', {
      endpoint: this.oneSignalEndpoint,
      hasApiKey: !!this.oneSignalApiKey,
      hasAppId: !!this.oneSignalAppId,
    });

    this.configureAxios();
  }

  private configureAxios(): void {
    if (!this.oneSignalApiKey) {
      console.warn(
        '⚠️ OneSignal API Key not found. Notifications will be skipped.',
      );
      return;
    }

    this.httpService.axiosRef.defaults.baseURL = this.oneSignalEndpoint;

    this.httpService.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${this.oneSignalApiKey}`;

    this.httpService.axiosRef.defaults.headers.common['Content-Type'] =
      'application/json';

    this.httpService.axiosRef.defaults.timeout = 10000;

    console.log('✅ Axios configured for OneSignal');
  }

  async sendNotification(
    userId: string,
    headline: string,
    message: string,
    send_after?: string,
    data?: Record<string, any>,
  ): Promise<CreateOneSignalMessageResponse> {
    if (
      !this.oneSignalEndpoint ||
      !this.oneSignalApiKey ||
      !this.oneSignalAppId
    ) {
      console.warn(
        '⚠️ OneSignal configuration incomplete. Skipping notification.',
      );
      return null;
    }

    console.log('📨 Preparing OneSignal notification:', {
      userId,
      headline,
      messageLength: message.length,
      send_after,
    });

    const payload: CreateOneSignalMessage = {
      app_id: this.oneSignalAppId,
      include_external_user_ids: [userId],
      headings: { en: headline },
      contents: { en: message },
      data: data || {},
      send_after: send_after || undefined,
    };

    try {
      console.log('🚀 Sending notification to OneSignal...');

      const response = await this.httpService.axiosRef.post(
        '/notifications',
        payload,
        {
          params: { c: 'push' },
        },
      );

      console.log('✅ OneSignal notification sent successfully:', {
        notificationId: response.data.id,
        recipients: response.data.recipients,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error sending OneSignal notification:', {
        error: error.message,
        url: `${this.oneSignalEndpoint}/notifications`,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await this.httpService.axiosRef.delete(
        `/notifications/${notificationId}`,
      );
      console.log(`✅ Notification ${notificationId} cancelled`);
    } catch (error: any) {
      console.error('❌ Error canceling notification:', {
        notificationId,
        error: error.message,
      });
    }
  }
}
