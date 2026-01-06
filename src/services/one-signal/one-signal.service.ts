import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CreateOneSignalMessage,
  CreateOneSignalMessageResponse,
} from './interfaces/messages.one-signal.interface';

@Injectable()
export class OneSignalService {
  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.defaults.baseURL = process.env.ONESIGNAL_ENDPOINT;
    this.httpService.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Key ${process.env.ONESIGNAL_API_KEY}`;
  }

  async sendNotification(
    userId: string,
    headline: string,
    message: string,
    send_after?: string,
    data?: Record<string, any>,
  ): Promise<CreateOneSignalMessageResponse> {
    const payload: CreateOneSignalMessage = {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_external_user_ids: [userId],
      headings: { en: headline },
      contents: { en: message },
      data: data || {},
      send_after: send_after || undefined,
    };

    try {
      const response = await this.httpService.axiosRef.post(
        '/notifications?c=push',
        payload,
      );

      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await this.httpService.axiosRef.delete(
        `/notifications/${notificationId}`,
      );
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  }
}
