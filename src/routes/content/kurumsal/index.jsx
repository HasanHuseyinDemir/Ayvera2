import { component$ } from '@builder.io/qwik';
import { Content } from '~/components/content';
import { LuShieldCheck, LuUsers, LuLock, LuAlertTriangle } from '@qwikest/icons/lucide';

const services = [
	{
		icon: LuShieldCheck,
		title: 'Entegre Güvenlik Çözümleri',
		desc: 'Fiziksel ve dijital güvenlik sistemlerini bir araya getirerek, kurumunuzun tüm varlıklarını bütüncül şekilde koruyoruz.',
	},
	{
		icon: LuUsers,
		title: 'Personel ve Ziyaretçi Güvenliği',
		desc: 'Çalışanlarınız ve ziyaretçileriniz için güvenli bir ortam oluşturuyor, riskleri en aza indiriyoruz.',
	},
	{
		icon: LuLock,
		title: 'Erişim Kontrol Sistemleri',
		desc: 'Yetkisiz girişleri önleyen, kartlı geçiş ve biyometrik sistemlerle üst düzey erişim güvenliği sağlıyoruz.',
	},
	{
		icon: LuAlertTriangle,
		title: 'Acil Durum ve Alarm Sistemleri',
		desc: 'Yangın, hırsızlık ve diğer acil durumlarda hızlı müdahale için akıllı alarm ve bildirim sistemleri kuruyoruz.',
	},
];

export const head = {
	title: 'Kurumsal | Ayvera Güvenlik',
	meta: [
		{
			name: 'description',
			content: 'Ayvera Güvenlik kurumsal çözümler, entegre güvenlik ve danışmanlık hizmetleri.',
		},
		{
			name: 'keywords',
			content: 'kurumsal, güvenlik, danışmanlık, entegre çözümler, ayvera',
		},
	],
};

export default component$(() => {
	return (
		<Content title="KURUMSAL GÜVENLİK" class="bg-gray-50">
			<section class="space-y-10">
				<div class="mb-8">
					<h2 class="text-2xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
						<LuShieldCheck class="w-7 h-7 text-cyan-600" /> Kurumsal Güvenlik Nedir?
					</h2>
					<p class="text-gray-700 leading-relaxed">
						Kurumsal güvenlik, işletmelerin çalışanlarını, ziyaretçilerini, bilgi varlıklarını ve fiziksel alanlarını iç ve dış tehditlere karşı korumak için aldığı bütüncül önlemler bütünüdür. Modern dünyada artan riskler ve karmaşık tehditler karşısında, sadece fiziksel değil; siber güvenlik, erişim kontrolü ve acil durum yönetimi gibi alanlarda da kapsamlı çözümler gereklidir.
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{services.map(({ icon: Icon, title, desc }) => (
						<div
							class="bg-white rounded-lg shadow-md p-6 flex items-start gap-4 border-l-4 border-cyan-500"
							key={title}
						>
							<Icon class="w-8 h-8 text-cyan-600 shrink-0" />
							<div>
								<h3 class="text-lg font-semibold mb-1 text-cyan-800">{title}</h3>
								<p class="text-gray-700 text-sm">{desc}</p>
							</div>
						</div>
					))}
				</div>

				<div class="mt-10">
					<h2 class="text-xl font-bold text-cyan-800 mb-3">Neden Kurumsal Güvenlik?</h2>
					<ul class="list-disc pl-6 space-y-2 text-gray-700">
						<li>İş sürekliliğini sağlamak ve operasyonel riskleri azaltmak</li>
						<li>Çalışan ve müşteri güvenliğini artırmak</li>
						<li>Kurumsal itibar ve marka değerini korumak</li>
						<li>Yasal yükümlülükleri ve standartları karşılamak</li>
						<li>Veri ve bilgi varlıklarını korumak</li>
					</ul>
				</div>

				<div class="mt-10 bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded shadow">
					<h2 class="text-lg font-semibold text-cyan-800 mb-2">Ayvera ile Güvende Olun</h2>
					<p class="text-gray-700">
						Ayvera olarak, kurumunuzun ihtiyaçlarına özel entegre güvenlik çözümleri sunuyoruz. Deneyimli ekibimiz ve ileri teknoloji altyapımız ile, risk analizi, sistem kurulumu ve sürekli destek hizmetleriyle yanınızdayız. Güvenliğinizi bize emanet edin, siz işinize odaklanın.
					</p>
				</div>
			</section>
		</Content>
	);
});