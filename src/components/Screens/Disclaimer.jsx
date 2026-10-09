import { useT } from '../../i18n';
import Button from '../Shared/Button';

const Disclaimer = ({ onAccept }) => {
    const t = useT();
    return (
        <div className="screen">
            <h1 className="accent">⚠️ {t('disclaimer_title')}</h1>
            <div className="panel stack small">
                <strong>{t('disclaimer_responsible')}</strong>
                <p>{t('disclaimer_age')}</p>
                <p>{t('disclaimer_pressure')}</p>
                <p>{t('disclaimer_drive')}</p>
            </div>
            <Button onClick={onAccept} className="full-width">{t('disclaimer_accept')}</Button>
            <p className="muted small center">{t('free_forever')}</p>
        </div>
    );
};

export default Disclaimer;
