import { component$ } from '@builder.io/qwik';
import { CardContainer } from './cardContainer';
import CardBlock from './cardblock';

export const Cozumler = component$(() => {
  return (
  <CardContainer>
        <CardBlock title="Alarm Sistemleri" bgImage="/evguvenlik.png"/>
        <CardBlock title="Kamera Sistemleri" bgImage="/cam.png"/>
        <CardBlock title="Ses Sistemleri" bgImage="/ses.png"/>
        <CardBlock title="Güvenlik Aparatları" bgImage="/aparat.png"/>
        <CardBlock title="Yangın Sistemleri" bgImage="/yangin.png"/>
        <CardBlock title="Kablo Çeşitleri" bgImage="/kablo.png"/>
        <CardBlock title="Geçiş Güvenlik Sistemleri" bgImage="/gecis.png"/>
    </CardContainer>
    )
});