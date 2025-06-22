import { component$ } from '@builder.io/qwik';
import { CardContainer } from './cardContainer';
import CardBlock from './cardblock';


export const Cozumler = component$(() => {
  return (
  <CardContainer>
        <CardBlock title="Alarm Sistemleri" bgImage="/stock/evguvenlik.png"/>
        <CardBlock title="Kamera Sistemleri" bgImage="/stock/cam.png"/>
        <CardBlock title="Ses Sistemleri" bgImage="/stock/ses.png"/>
        <CardBlock title="Güvenlik Aparatları" bgImage="/stock/aparat.png"/>
        <CardBlock title="Yangın Sistemleri" bgImage="/stock/yangin.png"/>
        <CardBlock title="Kablo Çeşitleri" bgImage="/stock/kablo.png"/>
        <CardBlock title="Geçiş Sistemleri" bgImage="/stock/gecis.png"/>
    </CardContainer>
    )
});