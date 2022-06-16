import React from 'react';
import defaultClasses from '../../css/forms.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useIntl } from 'react-intl';
import Select from '@magento/venia-ui/lib/components/Select';

const Countries = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const initialValue = 'US';

    const countries = [
        { value: 'AD', label: formatMessage({ id: 'country.AD', defaultMessage: 'Andorra' }) },
        { value: 'AE', label: formatMessage({ id: 'country.AE', defaultMessage: 'Emirs. Árabes Unidos' }) },
        { value: 'AI', label: formatMessage({ id: 'country.AI', defaultMessage: 'Anguilla' }) },
        { value: 'AN', label: formatMessage({ id: 'country.AN', defaultMessage: 'Angola' }) },
        { value: 'AO', label: formatMessage({ id: 'country.AO', defaultMessage: 'Angola' }) },
        { value: 'AR', label: formatMessage({ id: 'country.AR', defaultMessage: 'Argentina' }) },
        { value: 'AT', label: formatMessage({ id: 'country.AT', defaultMessage: 'Andorra' }) },
        { value: 'AU', label: formatMessage({ id: 'country.AU', defaultMessage: 'Austrália' }) },
        { value: 'BE', label: formatMessage({ id: 'country.BE', defaultMessage: 'Bélgica' }) },
        { value: 'BG', label: formatMessage({ id: 'country.BU', defaultMessage: 'Bulgária' }) },
        { value: 'BN', label: formatMessage({ id: 'country.BN', defaultMessage: 'Brunei Darussalam' }) },
        { value: 'BR', label: formatMessage({ id: 'country.BR', defaultMessage: 'Brasil' }) },
        { value: 'CA', label: formatMessage({ id: 'country.CA', defaultMessage: 'Canadá' }) },
        { value: 'CH', label: formatMessage({ id: 'country.CH', defaultMessage: 'Suíça' }) },
        { value: 'CI', label: formatMessage({ id: 'country.CI', defaultMessage: "Cote D'Ivoire" }) },
        { value: 'CL', label: formatMessage({ id: 'country.CL', defaultMessage: 'Chile' }) },
        { value: 'CN', label: formatMessage({ id: 'country.CN', defaultMessage: 'China' }) },
        { value: 'CO', label: formatMessage({ id: 'country.CO', defaultMessage: 'Colombia' }) },
        { value: 'CR', label: formatMessage({ id: 'country.CR', defaultMessage: 'COSTA RICA' }) },
        { value: 'CS', label: formatMessage({ id: 'country.CS', defaultMessage: 'Sérvia e Montenegro' }) },
        { value: 'CU', label: formatMessage({ id: 'country.CU', defaultMessage: 'Cuba' }) },
        { value: 'CV', label: formatMessage({ id: 'country.CV', defaultMessage: 'Cabo Verde' }) },
        { value: 'CY', label: formatMessage({ id: 'country.CY', defaultMessage: 'Chipre' }) },
        { value: 'CZ', label: formatMessage({ id: 'country.CZ', defaultMessage: 'República Checa' }) },
        { value: 'DE', label: formatMessage({ id: 'country.DE', defaultMessage: 'Alemanha' }) },
        { value: 'DK', label: formatMessage({ id: 'country.DK', defaultMessage: 'Dinamarca' }) },
        { value: 'DO', label: formatMessage({ id: 'country.DO', defaultMessage: 'R.Dominicana' }) },
        { value: 'DZ', label: formatMessage({ id: 'country.DZ', defaultMessage: 'Argélia' }) },
        { value: 'EE', label: formatMessage({ id: 'country.EE', defaultMessage: 'Estónia' }) },
        { value: 'EL', label: formatMessage({ id: 'country.EL', defaultMessage: 'Grecia' }) },
        { value: 'ES', label: formatMessage({ id: 'country.ES', defaultMessage: 'España' }) },
        { value: 'FI', label: formatMessage({ id: 'country.FI', defaultMessage: 'Finlândia' }) },
        { value: 'FJ', label: formatMessage({ id: 'country.FJ', defaultMessage: 'Ilhas Fiji' }) },
        { value: 'FR', label: formatMessage({ id: 'country.FR', defaultMessage: 'França' }) },
        { value: 'GB', label: formatMessage({ id: 'country.GB', defaultMessage: 'ReinoUnido' }) },
        { value: 'GF', label: formatMessage({ id: 'country.GF', defaultMessage: 'Guiana Francesa' }) },
        { value: 'GHA', label: formatMessage({ id: 'country.GHA', defaultMessage: 'Ghana' }) },
        { value: 'GIB', label: formatMessage({ id: 'country.GIB', defaultMessage: 'Gibraltar' }) },
        { value: 'GM', label: formatMessage({ id: 'country.GM', defaultMessage: 'Gambia' }) },
        { value: 'GP', label: formatMessage({ id: 'country.GP', defaultMessage: 'Guadalupe' }) },
        { value: 'GT', label: formatMessage({ id: 'country.GT', defaultMessage: 'Guatemala' }) },
        { value: 'GUI', label: formatMessage({ id: 'country.GUI', defaultMessage: 'Guinea' }) },
        { value: 'HK', label: formatMessage({ id: 'country.HK', defaultMessage: 'Hong Kong' }) },
        { value: 'HR', label: formatMessage({ id: 'country.HR', defaultMessage: 'Croácia' }) },
        { value: 'HU', label: formatMessage({ id: 'country.HU', defaultMessage: 'Hungria' }) },
        { value: 'ID', label: formatMessage({ id: 'country.ID', defaultMessage: 'Indonésia' }) },
        { value: 'IE', label: formatMessage({ id: 'country.IE', defaultMessage: 'Irlanda' }) },
        { value: 'IL', label: formatMessage({ id: 'country.IL', defaultMessage: 'Israel' }) },
        { value: 'IN', label: formatMessage({ id: 'country.IN', defaultMessage: 'Índia' }) },
        { value: 'IS', label: formatMessage({ id: 'country.IS', defaultMessage: 'Islândia' }) },
        { value: 'IT', label: formatMessage({ id: 'country.IT', defaultMessage: 'Itália' }) },
        { value: 'JP', label: formatMessage({ id: 'country.JP', defaultMessage: 'Japão' }) },
        { value: 'KE', label: formatMessage({ id: 'country.KE', defaultMessage: 'Quénia' }) },
        { value: 'KR', label: formatMessage({ id: 'country.KR', defaultMessage: 'Corea del Sur' }) },
        { value: 'LR', label: formatMessage({ id: 'country.LR', defaultMessage: 'Liberia' }) },
        { value: 'LT', label: formatMessage({ id: 'country.LT', defaultMessage: 'Lituânia' }) },
        { value: 'LU', label: formatMessage({ id: 'country.LU', defaultMessage: 'Luxemburgo' }) },
        { value: 'LV', label: formatMessage({ id: 'country.LV', defaultMessage: 'Letónia' }) },
        { value: 'MA', label: formatMessage({ id: 'country.MA', defaultMessage: 'Marruecos' }) },
        { value: 'MC', label: formatMessage({ id: 'country.MC', defaultMessage: 'Mónaco' }) },
        { value: 'ME', label: formatMessage({ id: 'country.ME', defaultMessage: 'Montenegro' }) },
        { value: 'MF', label: formatMessage({ id: 'country.MF', defaultMessage: 'Saint Martin' }) },
        { value: 'MO', label: formatMessage({ id: 'country.MO', defaultMessage: 'Marrocos' }) },
        { value: 'MQ', label: formatMessage({ id: 'country.MQ', defaultMessage: 'Martinique' }) },
        { value: 'MT', label: formatMessage({ id: 'country.MT', defaultMessage: 'Malta' }) },
        { value: 'MU', label: formatMessage({ id: 'country.MU', defaultMessage: 'Mauritius' }) },
        { value: 'MX', label: formatMessage({ id: 'country.MX', defaultMessage: 'México' }) },
        { value: 'MY', label: formatMessage({ id: 'country.MY', defaultMessage: 'Malásia' }) },
        { value: 'MZ', label: formatMessage({ id: 'country.MZ', defaultMessage: 'Moçambique' }) },
        { value: 'NG', label: formatMessage({ id: 'country.NG', defaultMessage: 'Nigéria' }) },
        { value: 'NL', label: formatMessage({ id: 'country.NL', defaultMessage: 'Países Baixos' }) },
        { value: 'NO', label: formatMessage({ id: 'country.NO', defaultMessage: 'Noruega' }) },
        { value: 'NZ', label: formatMessage({ id: 'country.NZ', defaultMessage: 'Nova Zelândia' }) },
        { value: 'PA', label: formatMessage({ id: 'country.PA', defaultMessage: 'Panamá' }) },
        { value: 'PE', label: formatMessage({ id: 'country.PE', defaultMessage: 'Perú' }) },
        { value: 'PF', label: formatMessage({ id: 'country.PF', defaultMessage: 'Polinesia Francesa' }) },
        { value: 'PH', label: formatMessage({ id: 'country.PH', defaultMessage: 'Filipinas' }) },
        { value: 'PK', label: formatMessage({ id: 'country.PK', defaultMessage: 'Paquistão' }) },
        { value: 'PL', label: formatMessage({ id: 'country.PL', defaultMessage: 'Polónia' }) },
        { value: 'PR', label: formatMessage({ id: 'country.PR', defaultMessage: 'Puerto Rico' }) },
        { value: 'PT', label: formatMessage({ id: 'country.PT', defaultMessage: 'Portugal' }) },
        { value: 'PY', label: formatMessage({ id: 'country.PY', defaultMessage: 'Paraguay' }) },
        { value: 'QA', label: formatMessage({ id: 'country.QA', defaultMessage: 'QATAR' }) },
        { value: 'RE', label: formatMessage({ id: 'country.RE', defaultMessage: 'Islas Reunión' }) },
        { value: 'RO', label: formatMessage({ id: 'country.RO', defaultMessage: 'Roménia' }) },
        { value: 'RS', label: formatMessage({ id: 'country.RS', defaultMessage: 'Sérvia' }) },
        { value: 'RU', label: formatMessage({ id: 'country.RU', defaultMessage: 'Rússia' }) },
        { value: 'SB', label: formatMessage({ id: 'country.SB', defaultMessage: 'Ilhas Salomão' }) },
        { value: 'SE', label: formatMessage({ id: 'country.SE', defaultMessage: 'Suécia' }) },
        { value: 'SG', label: formatMessage({ id: 'country.SG', defaultMessage: 'Singapura' }) },
        { value: 'SI', label: formatMessage({ id: 'country.SI', defaultMessage: 'Eslovénia' }) },
        { value: 'SK', label: formatMessage({ id: 'country.SK', defaultMessage: 'Eslováquia' }) },
        { value: 'SL', label: formatMessage({ id: 'country.SL', defaultMessage: 'Sierra Leona' }) },
        { value: 'ST', label: formatMessage({ id: 'country.ST', defaultMessage: 'Saint Martin' }) },
        { value: 'STP', label: formatMessage({ id: 'country.STP', defaultMessage: 'São Tomé e Príncipe' }) },
        { value: 'SV', label: formatMessage({ id: 'country.SV', defaultMessage: 'El Salvador' }) },
        { value: 'SX', label: formatMessage({ id: 'country.SX', defaultMessage: 'Sint Maarten' }) },
        { value: 'SZ', label: formatMessage({ id: 'country.SZ', defaultMessage: 'Suazilândia' }) },
        { value: 'TH', label: formatMessage({ id: 'country.TH', defaultMessage: 'Tailândia' }) },
        { value: 'TN', label: formatMessage({ id: 'country.TN', defaultMessage: 'Tunísia' }) },
        { value: 'TR', label: formatMessage({ id: 'country.TR', defaultMessage: 'Turquia' }) },
        { value: 'TW', label: formatMessage({ id: 'country.TW', defaultMessage: 'Taiwán' }) },
        { value: 'TZ', label: formatMessage({ id: 'country.TZ', defaultMessage: 'Uganda' }) },
        { value: 'US', label: formatMessage({ id: 'country.US', defaultMessage: 'E.U.A.' }) },
        { value: 'UY', label: formatMessage({ id: 'country.UY', defaultMessage: 'Uruguay' }) },
        { value: 'VA', label: formatMessage({ id: 'country.VA', defaultMessage: 'VATICANO' }) },
        { value: 'VN', label: formatMessage({ id: 'country.VN', defaultMessage: 'Vietnam' }) },
        { value: 'VU', label: formatMessage({ id: 'country.VU', defaultMessage: 'Vanuatu' }) },
        { value: 'WS', label: formatMessage({ id: 'country.WS', defaultMessage: 'Samoa' }) },
        { value: 'ZA', label: formatMessage({ id: 'country.ZA', defaultMessage: 'África do Sul' }) }
    ];

    return (
        <span className={classes.root}>
            <span className={classes.input}>
                <Select field="country" initialValue={initialValue} items={countries} />
            </span>
            <span className={classes.before} />
            <span className={classes.after}>
                <span className={classes.icon}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className={classes.iconContent}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </span>
        </span>
    );
};

export default Countries;
