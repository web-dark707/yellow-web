import { t } from 'i18next';
import { Toast } from '@/components/vip-ui';

export function checkStatus(status: number): void {
    let errMessage = '';

    switch (status) {
        case 400:
            errMessage = t('app.message.error.http400');
            break;
        case 401:
            errMessage = t('app.message.error.http401');
            break;
        case 403:
            errMessage = t('app.message.error.http403');
            break;
        case 404:
            errMessage = t('app.message.error.http404');
            break;
        case 405:
            errMessage = t('app.message.error.http405');
            break;
        case 408:
            errMessage = t('app.message.error.http408');
            break;
        case 500:
            errMessage = t('app.message.error.http500');
            break;
        case 501:
            errMessage = t('app.message.error.http501');
            break;
        case 502:
            errMessage = t('app.message.error.http502');
            break;
        case 503:
            errMessage = t('app.message.error.http503');
            break;
        case 504:
            errMessage = t('app.message.error.http504');
            break;
        case 505:
            errMessage = t('app.message.error.http505');
            break;
        default:
            errMessage = t('app.message.error.httpUnknown');
            break;
    }
    if (errMessage) {
        Toast.error({
            content: errMessage,
        });
    }
}
