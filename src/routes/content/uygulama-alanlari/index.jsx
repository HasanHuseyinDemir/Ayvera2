import { component$ } from '@builder.io/qwik';
import { Content } from '~/components/content';

export const head = {
    title: 'Uygulama Alanları | Ayvera Güvenlik',
    meta: [
        { name: 'description', content: 'Ayvera Güvenlik çözümlerinin uygulandığı sektörler ve alanlar.' },
        { name: 'keywords', content: 'uygulama alanları, sektörler, güvenlik çözümleri, ayvera' }
    ]
};

export default component$(() => (
    <Content title="Uygulama Alanları">
        <p class="mb-4">Güvenlik çözümlerimizin uygulandığı sektörler ve alanlar hakkında bilgi edinin.</p>
    </Content>
));
