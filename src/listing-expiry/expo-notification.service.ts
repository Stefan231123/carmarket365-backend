import { Injectable, Logger } from '@nestjs/common';

export interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default' | null;
}

@Injectable()
export class ExpoNotificationService {
  private readonly logger = new Logger(ExpoNotificationService.name);
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  async sendBatch(messages: ExpoPushMessage[]): Promise<void> {
    const valid = messages.filter(
      (m) => m.to && m.to.startsWith('ExponentPushToken['),
    );

    if (valid.length === 0) return;

    // Expo allows up to 100 messages per batch
    for (let i = 0; i < valid.length; i += 100) {
      const chunk = valid.slice(i, i + 100);
      try {
        const response = await fetch(this.EXPO_PUSH_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chunk),
        });

        if (!response.ok) {
          const text = await response.text();
          this.logger.error(`Expo Push API error: ${response.status} - ${text}`);
        }
      } catch (error) {
        this.logger.error(`Batch push notification failed: ${error}`);
      }
    }

    this.logger.log(`Sent ${valid.length} push notification(s)`);
  }
}
