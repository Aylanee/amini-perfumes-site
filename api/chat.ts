// api/chat.ts
// Conseillère IA Amini Perfumes — Vercel Edge Function
// Supporte 2 providers : Mistral AI (priorité) ET Gemini (fallback).
// Une seule des deux clés suffit pour faire fonctionner l'IA.

export const config = { runtime: 'edge' };

const MODEL_GEMINI = "gemini-2.5-flash-lite";
const MODEL_MISTRAL = "mistral-small-latest"; // gratuit, large fenêtre, bon en français

const CATALOGUE = `- Chanel Chance Eau Tendre | femme | floral/fruité | printemps/été/automne | journee/travail | notes: سفرجل، غريب فروت | ناعم فاكهي، كل بنات يحبوه | ⭐⭐
- Chanel Gabrielle | femme | floral | printemps/été/automne | mariage/travail | notes: برغموت، ماندارين | زهور بيضاء عصرية، أناقة شانيل المطلقة | ⭐⭐
- Chanel Coco Mademoiselle | femme | oriental/floral | printemps/automne/hiver | journee | notes: برتقال، برغموت | أيقوني، الناس تعرفه فوراً | ⭐ BEST
- Chanel N°5 | femme | floral | printemps/été/automne/hiver | travail | notes: إلدهيدات، إيلانغ | الأسطورة، كل المواسم | ⭐⭐
- Chanel Allure Homme Sport | homme | citronné/boisé | printemps/été/automne | journee/travail | notes: برتقال، فلفل أبيض، نعناع | الأول صيفياً للرجال | ⭐
- Chanel Bleu de Chanel | homme | boisé | automne/hiver/printemps | journee | notes: غريب فروت، ليمون | الأيقوني الرجالي | ⭐ BEST
- Dior J'adore | femme | floral | printemps/été/automne/hiver | journee/mariage | notes: كمثرى، ماندارين | الكلاسيكي اللي ما يموتش | ⭐⭐ BEST
- Dior J'adore Lumière | femme | floral/citronné | printemps/été/automne | journee | notes: ماندارين، ليمون | نسخة شفافة منعشة | ⭐⭐ BEST
- Dior Miss Dior Blooming Bouquet | femme | floral/fruité | printemps/été/automne | journee/mariage | notes: مانداريم، خوخ | رومانسي خفيف، عروس صيفية | ⭐⭐
- Dior Hypnotic Poison | femme | oriental | automne/hiver | soiree | notes: كمثرى، خشب البرقوق | ساحر، إدمان حقيقي | ⭐
- Dior Sauvage | homme | citronné | printemps/été/automne/hiver | journee/mariage/soiree/travail | notes: برغموت، فلفل | الأكثر مبيعاً، رجولي | ⭐⭐⭐ BEST
- Dior Sauvage Elixir | homme | oriental | automne/hiver | soiree | notes: دارسين، جوزة الطيب | مكثف، ليلي | ⭐ BEST
- Dior Dior Homme Cologne | homme | citronné | printemps/été | journee/travail | notes: برغموت، ليمون أصفر | حمضي نظيف فاخر | ⭐⭐⭐
- Dior Dior Homme Intense | homme | poudré | printemps/automne/hiver | journee/mariage | notes: لافندر | أنيق جداً، أيريس فاخر | ⭐⭐
- Dior Joy | femme | floral/citronné | printemps/été/automne | journee | notes: برغموت، ماندارين | مشمس وفرحان | ⭐⭐
- Dior Poison Girl | femme | oriental/sucré | automne/hiver | soiree | notes: برتقال، ليمون | ورد حلو ومتمرد | ⭐
- Dior Sakura | femme | floral | printemps/été | journee | notes: برغموت، ماندارين | شفاف ناعم | ⭐⭐
- Dior Dune | femme | oriental/aquatique | printemps/été/automne | journee | notes: برغموت، ميمولا | فريد، صحراوي بحري | ⭐
- Dior Bois d'Argent | unisexe | boisé | automne/hiver | soiree | notes: مر | فاخر شتوي | ⭐
- Dior Oud Ispahan | femme | oriental | automne/hiver | mariage | notes: ورد بلغاري | عود فاخر، شرقي خالص | ⭐
- Dior Fahrenheit | homme | cuir | automne/hiver | soiree | notes: ماندارين، نبق البحر | أسطوري جلدي | ⭐
- YSL Black Opium | femme | oriental | printemps/automne/hiver | soiree | notes: كمثرى، فلفل وردي | القهوة + الفانيلا = إدمان | ⭐ BEST
- YSL Libre | femme | floral | printemps/été/automne/hiver | journee | notes: لافندر، ماندارين، كشمش | لافندر عصري حر | ⭐⭐
- YSL La Nuit de l'Homme | homme | oriental | automne/hiver | soiree | notes: كارداموم | الأكثر إغراءً للرجال | ⭐
- YSL Y EDP | homme | fougère | printemps/été/automne | journee/travail | notes: تفاح، زنجبيل | عصري نظيف | ⭐
- YSL Myslf | homme | floral/boisé | printemps/été/automne/hiver | soiree | notes: برغموت | جديد، زهري رجالي | ⭐⭐
- YSL Manifesto | femme | floral/oriental | printemps/automne/hiver | soiree | notes: كشمش أسود | حلو راقي | ⭐
- Armani Acqua Di Gio | homme | citronné | printemps/été/automne | journee | notes: برغموت، نيرولي | الكلاسيكي البحري | ⭐⭐⭐
- Armani My Way | femme | floral | printemps/été/automne | journee | notes: برغموت، زهر البرتقال | زهور بيضاء حديثة | ⭐⭐
- Armani My Way Nectar | femme | floral/sucré | printemps/été/automne/hiver | journee | notes: كمثرى، عسل | نسخة أحلى من Original | ⭐⭐
- Armani Sì | femme | chypré | printemps/été/automne/hiver | journee | notes: كشمش أسود | كرز فاخر، الأنيقات | ⭐
- Armani Stronger With You | homme | sucré | printemps/été/automne/hiver | soiree | notes: كستناء، فلفل وردي | الكستناء + الفانيلا | ⭐
- Armani Stronger With You Intensely | homme | oriental | automne/hiver | soiree | notes: لافندر، نعناع | مكثف وعميق | ⭐
- Armani Code Profumo | homme | oriental | automne/hiver | soiree | notes: كاردامون | فاخر ليلي | ⭐
- Azzaro Chrome | homme | citronné | printemps/été/automne | journee | notes: ليمون أصفر، أوكاليبتوس | الكلاسيكي الصيفي | ⭐⭐⭐
- Azzaro Wanted | homme | fougère/citronné | printemps/été/automne | journee | notes: زنجبيل، ليمون أصفر | حيوي شبابي | ⭐⭐⭐
- Azzaro Most Wanted | homme | sucré | printemps/été/automne/hiver | soiree | notes: تفاح، كاردامون | حلو وفاخر | ⭐
- Azzaro Wanted by Night | homme | oriental | automne/hiver | soiree | notes: فلفل، كاردامون | ليلي مغري | ⭐
- Hugo Boss Boss Bottled | homme | fougère | printemps/été/automne/hiver | journee/travail | notes: تفاح، خوخ، برقوق | الكلاسيكي الرجالي | ⭐
- Hugo Boss Boss Bottled Elixir | homme | fougère | printemps/été/automne/hiver | soiree | notes: كاردامون، فلفل | النسخة المكثفة | ⭐
- Hugo Boss The Scent | homme | oriental | printemps/été/automne/hiver | soiree | notes: زنجبيل، مايز | الزنجبيل الفريد | ⭐
- Hugo Boss Unlimited | homme | مائي عشبي | printemps/été/automne | journee | notes: تفاح، نعناع | منعش رياضي | ⭐⭐⭐
- Paco Rabanne Invictus | homme | sucré | printemps/été/automne | journee | notes: غريب فروت، ماندارين | الأكثر شعبية للشباب | ⭐
- Paco Rabanne Invictus Victory Elixir | homme | oriental | automne/hiver | soiree | notes: منديرين، فلفل | مكثف فاخر | ⭐
- Paco Rabanne One Million Lucky | homme | oriental/sucré | printemps/été/automne/hiver | soiree | notes: ليكواي، خوخ | الحلو المحظوظ | ⭐ BEST
- Paco Rabanne Phantom | homme | citronné | printemps/été/automne | mariage | notes: ليمون أصفر، لافندر | تكنولوجي عصري | ⭐⭐⭐
- Paco Rabanne Lady Million | femme | floral/chypré | printemps/été/automne/hiver | soiree | notes: نيرولي، توت | عسل ذهبي مغري | ⭐⭐
- Paco Rabanne Olympea | femme | oriental | printemps/été/automne/hiver | soiree | notes: برغموت، ماندارين، خضراء | فانيلا مالحة فريدة | ⭐
- Paco Rabanne Pure XS | homme | oriental | automne/hiver | soiree | notes: زنجبيل، ثيم | حار مغري | ⭐
- JPG Le Mâle | homme | fougère/oriental | printemps/été/automne/hiver | journee/soiree | notes: لافندر، نعناع | الأيقوني، فانيلا الرجال | ⭐ BEST
- JPG Le Mâle Elixir | homme | oriental | automne/hiver | soiree | notes: لافندر، عسل | النسخة الفاخرة 2023 | ⭐ BEST
- JPG Ultra Mâle | homme | fruité/sucré | automne/hiver | soiree | notes: كمثرى، نعناع، لافندر | الكمثرى المغرية | ⭐
- JPG Le Beau | homme | يلانج جوز هند | printemps/été/automne | journee | notes: برغموت، جوز هند | جوز هند صيفي | ⭐
- JPG Scandal | femme | floral | printemps/automne/hiver | soiree | notes: برغموت | العسل المثير | ⭐⭐
- JPG La Belle | femme | oriental/sucré | printemps/automne/hiver | journee | notes: كمثرى، نعناع | حلو راقي | ⭐
- CH Good Girl | femme | floral/oriental | printemps/automne/hiver | soiree | notes: لوز، قهوة | الكعب الأسود الأيقوني | ⭐ BEST
- CH Good Girl Blush | femme | floral | printemps/été/automne | journee | notes: بنفسج | النسخة الناعمة | ⭐⭐ BEST
- Lancôme La Vie est Belle | femme | floral/fruité/sucré | printemps/automne/hiver | journee | notes: كشمش أسود، كمثرى | الأكثر مبيعاً، حلو راقي | ⭐⭐ BEST
- Lancôme Idôle | femme | floral | printemps/été/automne | journee/travail | notes: بيرغموت، كمثرى | ورد عصري نظيف | ⭐⭐
- Lancôme La Nuit Trésor | femme | oriental/sucré | automne/hiver | soiree | notes: ليتشي، توت | حلو ليلي ساحر | ⭐
- Lancôme Hypnôse | femme | oriental/floral | printemps/automne/hiver | soiree | notes: باسيون فروت، توت | فانيلا حسية | ⭐
- Guerlain Mon Guerlain | femme | oriental/floral | automne/hiver | mariage/soiree | notes: لافندر، برغموت | لافندر فاخر، كل المواسم | ⭐
- Guerlain Pêche Mirage | femme | fruité/floral | printemps/été/automne | journee | notes: خوخ، برغموت | جديد 2024، خوخ مميز | ⭐⭐
- Guerlain L'Instant | femme | floral | printemps/automne/hiver | journee | notes: ماندارين، ماغنوليا | العسل الناعم | ⭐⭐
- Versace Eros Pour Homme | homme | fougère/oriental | printemps/été/automne/hiver | journee/soiree | notes: نعناع، تفاح، ليمون | النعناع المثير | ⭐
- Versace Dylan Blue | homme | fougère | printemps/été/automne | journee/travail | notes: كالابريا برغموت، غريب فروت | مائي عصري | ⭐⭐⭐
- Versace Crystal Noir | femme | floral/oriental | automne/hiver | soiree | notes: كاردامون، زنجبيل | غامض ليلي | ⭐
- LV Rose des Vents | femme | floral/citronné | printemps/été/automne | mariage | notes: فلفل، ماندارين | الورد الفاخر | ⭐⭐
- LV Pacific Chill | unisexe | citronné | printemps/été/automne | journee | notes: برتقال، ليمون، غريب فروت، توت | استوائي فاخر | ⭐⭐⭐
- LV Afternoon Swim | unisexe | citronné | printemps/été/automne | journee | notes: برتقال، ماندارين صقلي | بحر فاخر | ⭐⭐⭐
- LV City of Stars | femme | citronné/musqué | printemps/été/automne | journee | notes: ماندارين | ليالي LA الفاخرة | ⭐⭐⭐
- LV Imagination | homme | citronné/boisé | printemps/été/automne/hiver | journee | notes: برغموت، أوسمانتوس | شاي فاخر | ⭐
- LV Contre Moi | femme | oriental | automne/hiver | soiree | notes: زهر البرتقال | شوكولا فاخرة | ⭐
- LV Mille Feux | femme | cuir | automne/hiver | soiree | notes: فراولة، ليتشي | جلد ناري | ⭐
- LV Matière Noire | unisexe | boisé/oriental | automne/hiver | soiree | notes: باتشولي | مظلم فاخر | ⭐
- PdM Delina | femme | floral | printemps/automne/hiver | mariage/soiree | notes: برغموت، ماندارين | الأيقوني، عروس راقية | ⭐⭐
- PdM Delina Exclusif | femme | floral/oriental | automne/hiver | mariage | notes: تركي ورد | النسخة الأفخم | ⭐
- PdM Layton Exclusif | homme | oriental/boisé | automne/hiver | soiree | notes: مر، ميرامين | فاخر جداً | ⭐
- PdM Althair | homme | sucré | printemps/été/automne/hiver | soiree | notes: كاردامون، نوتميغ | فانيلا فاخرة | ⭐
- MFK Baccarat Rouge 540 | unisexe | oriental/floral | printemps/été/automne/hiver | journee/mariage/soiree/travail | notes: زعفران، ياسمين | الأسطورة، أيقوني | ⭐ BEST
- Tom Ford Tobacco Vanille | unisexe | oriental/tabac | automne/hiver | soiree | notes: تبغ، توابل | التبغ الفاخر، أيقوني | ⭐
- Tom Ford Ombré Nomade | unisexe | floral | automne/hiver | soiree | notes: مر، رازبيري | عود فاخر صحراوي | ⭐
- Tom Ford Ombré Leather | unisexe | cuir | automne/hiver | soiree | notes: كاردامون | جلد قوي | ⭐
- Tom Ford Electric Cherry | unisexe | fruité/sucré | printemps/été/automne/hiver | soiree | notes: كرز، خوخ | كرز إدمان | ⭐
- Kayali Vanilla 28 | femme | فانيلا | automne/hiver | soiree | notes: برازيلي توت | الفانيلا الإدمان | ⭐
- Kayali Marshmallow Wedding Silk | femme | sucré | printemps/automne/hiver | mariage/soiree | notes: ليتشي، توت | حرير الأعراس بحرف | ⭐
- Kayali Eden Juicy Apple | femme | fruité | printemps/été/automne/hiver | journee | notes: تفاح، توت | تفاح حلو | ⭐⭐
- Kayali Sweet Banana | femme | fruité/sucré | été/automne/hiver | soiree | notes: موز، فراولة | جديد 2024، موز فريد | ⭐
- Kayali Vanilla Candy Rock Sugar | femme | sucré | automne/hiver | soiree | notes: سكر، توت | جديد، فانيلا حلوى | ⭐
- Kayali Eden Sparkling Lychee | femme | fruité | printemps/été/automne | journee | notes: ليتشي، شامبانيا، فلفل وردي | ليتشي فوار | ⭐⭐
- Lattafa Yara | femme | oriental/sucré | printemps/été/automne/hiver | journee | notes: تاهيتي، أوركيد | الأكثر شعبية، حلو | ⭐ BEST
- Lattafa Yara Candy | femme | sucré/fruité | printemps/été/automne/hiver | journee | notes: فواكه حمراء | النسخة الأحلى | ⭐ BEST
- Lattafa Khamrah | unisexe | oriental | automne/hiver | mariage | notes: دارسين، نوتميغ | القهوة العربية الفاخرة | ⭐ BEST
- Lattafa Khamrah Dukhan | unisexe | oriental | automne/hiver | soiree | notes: دارسين | النسخة المدخنة | ⭐ BEST
- Lattafa Ameer Al Oudh | unisexe | عود | automne/hiver | mariage | notes: زعفران، فلفل | عود ثقيل أصيل | ⭐
- Asdaaf Ameerat Al Arab | femme | oriental/sucré | été/automne/hiver | mariage | notes: فواكه، فلفل | أميرة العرب | ⭐
- Al Haramain Sapphire Clouds | unisexe | oriental | printemps/été/automne/hiver | soiree | notes: بنفسج، فاكهة | غيوم زرقاء | ⭐
- Al Jazeera Paris Musk | unisexe | musqué | printemps/été/automne/hiver | journee/mariage | notes: أبيض زهر | مسك باريسي ناعم | ⭐⭐
- Al Rehab Al Fares | homme | oriental | été/automne/hiver | mariage | notes: فاكهة | الفارس العربي | ⭐
- Al Rehab Soft | unisexe | musqué | printemps/été/automne/hiver | journee | notes: أبيض | ناعم رخيص ممتاز | ⭐⭐
- Kajal Almaz | femme | oriental | automne/hiver | mariage | notes: ليتشي، ماندارين | الماس فاخر | ⭐
- Kajal Ruby | femme | oriental/fruité | printemps/automne/hiver | soiree | notes: فواكه حمراء | الياقوت | ⭐
- Kajal Paris | femme | floral/oriental | été/automne/hiver | mariage | notes: برغموت | باريس-عربي | ⭐
- Kajal Lamar | femme | oriental | automne/hiver | soiree | notes: فلفل، فواكه | لمار العميق | ⭐
- Mancera Coco Vanille | femme | sucré | automne/hiver | soiree | notes: فواكه حمراء، باتشولي | جوز الهند المغري | ⭐
- Mancera Black Vanilla | unisexe | فانيلا | automne/hiver | soiree | notes: ساندي، خشخاش | فانيلا قوية | ⭐
- Mancera Red Tobacco | unisexe | tabac/sucré | automne/hiver | soiree | notes: فلفل، فواكه | تبغ أحمر فاخر | ⭐
- Mancera Rose Vanille | femme | ورد فانيلا | printemps/automne/hiver | journee | notes: برغموت، توت | ورد + فانيلا = حب | ⭐
- Mancera Fabulous Yuzu | unisexe | citronné | printemps/été/automne | journee | notes: يوزو، برغموت | يوزو منعش فاخر | ⭐⭐⭐
- Nishane Hacivat | unisexe | fruité/boisé | printemps/été/automne | journee | notes: برغموت، كشمش، أناناس | أناناس فاخر | ⭐
- Nishane Hundred Silent Ways | unisexe | oriental | automne/hiver | soiree | notes: فاكهة | مئة طريقة صامتة | ⭐
- Xerjoff Naxos | homme | oriental/tabac | automne/hiver | soiree | notes: لافندر، برغموت | تحفة إيطالية | ⭐
- Xerjoff Torino 21 | unisexe | كراميل | automne/hiver | soiree | notes: مفاجأة | كراميل إيطالي فاخر | ⭐
- Sospiro Accento | femme | fruité | printemps/été/automne/hiver | journee | notes: باسيون فروت، أناناس، كمثرى | فاكهي إيطالي | ⭐⭐
- Sospiro Il Padrino | unisexe | oriental | automne/hiver | soiree | notes: فلفل | الأب الروحي 2024 | ⭐
- Serge Lutens Ambre Sultan | unisexe | عنبر | automne/hiver | soiree | notes: ورق الغار، إكليل الجبل | العنبر الأسطوري | ⭐
- Marc-Antoine Barrois Ganymede | unisexe | fruité/boisé | printemps/été/automne | journee | notes: ماندارين | فني ومميز | ⭐
- Matière Première Vanilla Powder | unisexe | poudré | printemps/été/automne/hiver | journee | notes: فانيلا | فانيلا ناعمة فاخرة | ⭐
- Essential Parfums Bois Impérial | unisexe | boisé/citronné | printemps/été/automne/hiver | journee | notes: غريب فروت | خشبي عصري | ⭐
- Creed Aventus | homme | fruité/boisé | printemps/été/automne/hiver | journee/mariage/soiree/travail | notes: أناناس، تفاح، كشمش، برغموت | الأسطورة الرجالية | ⭐ BEST
- Creed Viking | homme | fougère | printemps/été/automne/hiver | soiree | notes: برغموت، نعناع | فايكنغ قوي | ⭐
- Hermès Terre d'Hermès | homme | boisé/citronné | automne/hiver/printemps | journee | notes: برغموت، غريب فروت | الأرضي الفاخر | ⭐
- Hermès Le Jardin de Monsieur Li | unisexe | citronné/floral | printemps/été/automne | journee | notes: كومكوات، نعناع، ياسمين | حديقة صينية فاخرة | ⭐⭐
- Cartier Baiser Volé | femme | زنبق | printemps/été/automne | journee | notes: أوراق الزنبق | الزنبق الأبيض | ⭐
- Cartier La Panthère | femme | chypré/floral | printemps/été/automne/hiver | journee | notes: غاردينيا | الفهد الأنثوي | ⭐⭐
- Bulgari Eau Parfumée au Thé Noir | unisexe | citronné | printemps/été/automne/hiver | journee | notes: برغموت، شاي أسود | شاي أسود فاخر | ⭐⭐⭐
- Bulgari Men in Black | homme | oriental | automne/hiver | soiree | notes: فلفل أسود، رم | الرجال في الأسود | ⭐
- Burberry Her | femme | fruité/floral | printemps/été/automne | journee | notes: فواكه حمراء، فراولة، توت | الفواكه الحمراء | ⭐⭐
- Burberry Goddess | femme | oriental | printemps/été/automne/hiver | soiree | notes: لافندر، فاكهة | إلهة 2023 | ⭐
- Givenchy L'Interdit | femme | floral | printemps/été/automne/hiver | soiree | notes: كمثرى، برغموت | الممنوع | ⭐⭐
- Givenchy Irresistible | femme | floral | printemps/été/automne | journee | notes: ورد، كمثرى | ورد عصري نظيف | ⭐⭐
- Givenchy Gentleman | homme | floral/boisé | printemps/été/automne/hiver | journee | notes: كاردامون، لافندر | الجنتلمان الحقيقي | ⭐⭐
- Issey Miyake L'Eau d'Issey | femme | floral | printemps/été/automne | journee | notes: زهر اللوتس، زنبق الماء | الماء النقي | ⭐⭐
- Prada Paradoxe | femme | floral | printemps/été/automne/hiver | journee | notes: نيرولي | مفارقة | ⭐⭐
- Prada Paradoxe Intense | femme | oriental/floral | printemps/automne/hiver | soiree | notes: كمثرى | النسخة المكثفة | ⭐
- Prada Paradoxe Virtual Flower | femme | floral | printemps/été/automne | journee | notes: برغموت | جديد 2024 | ⭐⭐
- Prada Infusion de Rhubarbe | unisexe | citronné | printemps/été/automne | journee | notes: راوند، نعناع | منعش فني | ⭐⭐⭐
- Roberto Cavalli Paradiso | femme | citronné/floral | printemps/été/automne | journee | notes: برغموت، ماندارين | جنة صيفية | ⭐⭐
- Viktor&Rolf Flowerbomb Tiger Lily | femme | floral | printemps/été/automne | journee/soiree | notes: ماندارين، فلفل | زنبق ناري 2024 | ⭐⭐
- Viktor&Rolf Spicebomb | homme | oriental | automne/hiver | soiree | notes: برغموت، غريب فروت | قنبلة التوابل | ⭐
- Lacoste L.12.12 Légère | homme | citronné | printemps/été/automne | journee | notes: برغموت | خفيف نظيف | ⭐⭐⭐
- Lacoste Blanc | homme | fougère | printemps/été/automne | journee | notes: كاردامون، روزماري | الأبيض النظيف | ⭐
- Lacoste Noir | homme | sucré | automne/hiver | soiree | notes: فلفل أسود | شوكولا أسود | ⭐
- Montblanc Explorer | homme | boisé | printemps/été/automne | journee | notes: برغموت، إيطالي | مستكشف | ⭐
- Montblanc Legend | homme | fougère | printemps/été/automne | journee | notes: برغموت، لافندر، أناناس | أسطورة | ⭐
- Ralph Lauren Polo Blue | homme | مائي | printemps/été/automne | journee | notes: بطيخ، خيار، نعناع | الأزرق الكلاسيكي | ⭐⭐⭐
- Ralph Lauren Polo Red Extreme | homme | oriental | automne/hiver | soiree | notes: كرز، قرنفل | القهوة الناري | ⭐
- Nautica Voyage | homme | مائي أخضر | printemps/été/automne | journee/travail | notes: تفاح، أوراق | البحر الرخيص الفاخر | ⭐⭐⭐
- Musc Yara | femme | musqué/sucré | printemps/été/automne/hiver | journee | notes: مفاجأة | كل المواسم | ⭐ BEST
- Musc Al Tout | femme | musqué/fruité | printemps/été/automne/hiver | journee | notes: توت | مسك التوت | ⭐⭐
- Musc Vanilla | unisexe | musqué/sucré | automne/hiver | soiree | notes: فانيلا | فانيلا دافئة | ⭐
- Musc Yemen | unisexe | مسك أبيض | printemps/été/automne/hiver | journee | notes: مسك خام | مسك يمني تقليدي | ⭐⭐
- Musc Al Romane | femme | musqué/fruité | printemps/été/automne/hiver | journee | notes: رمان، توت | مسك الرمان | ⭐⭐
- Musc Al Ghram | unisexe | musqué | automne/hiver | soiree | notes: مسك | مسك الغرام | ⭐⭐
- Musc Ananas | unisexe | musqué/fruité | printemps/été/automne | journee | notes: أناناس | مسك الأناناس | ⭐⭐
- Musc Pomme | unisexe | musqué/fruité | printemps/été/automne | journee | notes: تفاح أخضر | مسك التفاح | ⭐⭐
- Musc الأبيض | unisexe | musqué | printemps/été/automne/hiver | journee | notes: مسك خام | مسك أبيض كل المواسم | ⭐⭐
- Amouage Purpose | unisexe | Orientale | automne/hiver | mariage/soiree | notes: ambre, encens, épices | ريحة شرقية فخمة: ambre، encens — تقعد معاك طول الليل | ⭐
- Amouage Ouverture Man | homme | Orientale | automne/hiver | mariage/soiree | notes: safran, lavande, tabac | ريحة شرقية فخمة: safran، lavande — تقعد معاك طول الليل | ⭐
- Amouage Decision | unisexe | Orientale | automne/hiver | mariage/soiree | notes: oud, ambre, épices | شرقي راقي بـoud، ambre، يفوح من بعيد ويخلي أثر | ⭐
- Antonio Banderas Bleu séduction | homme | Aquatique | printemps/été | journee/travail | notes: bergamote, menthe, bois | نسمة بحر منعشة: bergamote، menthe — برودة ونقاء الصيف | ⭐⭐⭐
- Armani Code | homme | Orientale | automne/hiver | mariage/soiree | notes: citron, fève tonka, anis | ريحة شرقية فخمة: citron، fève tonka — تقعد معاك طول الليل | ⭐
- Armani Si Giorgio | femme | Fruitée | printemps/été/automne | journee/mariage | notes: cassis, rose, vanille | فواكه منعشة: cassis، rose — حيوية وطاقة طول النهار | ⭐⭐
- Armani Privé Iris Bleu | unisexe | Poudrée | printemps/automne/hiver | journee/mariage | notes: iris, violette, musc | بودري ناعم: iris، violette — رقة وأناقة قديمة | ⭐⭐
- Armani Privé Rose d'Arabie | unisexe | Orientale | automne/hiver | mariage/soiree | notes: rose, oud, ambre | ريحة شرقية فخمة: rose، oud — تقعد معاك طول الليل | ⭐
- Armani Privé Rouge Malachite | unisexe | Florale | printemps/été/automne | journee/mariage | notes: tubéreuse, ambre, bois | ريحة زهور صافية بـtubéreuse، ambre، خفيفة ومريحة | ⭐
- BDK Parfums Pas ce soir | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: poire, iris, caramel | ريحة حلوة تشهّي: poire، iris — اللي يشمها يسقسي عليها | ⭐
- Britney Spears Private Show | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: café glacé, fruits, ambre | ريحة حلوة تشهّي: café glacé، fruits — اللي يشمها يسقسي عليها | ⭐
- Burberry Week-end | femme | Florale | printemps/été/automne | journee/mariage | notes: pêche, iris, cèdre | زهري ناعم وراقي: pêche، iris — أنوثة وأناقة | ⭐⭐
- Burberry My Burberry | femme | Florale | printemps/été/automne | journee/mariage | notes: pois de senteur, géranium, patchouli | زهري ناعم وراقي: pois de senteur، géranium — أنوثة وأناقة | ⭐⭐
- Burberry Body burberry | femme | Florale | printemps/été/automne | journee/mariage | notes: pêche, iris, musc | زهري ناعم وراقي: pêche، iris — أنوثة وأناقة | ⭐⭐
- Burberry Godess | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: vanille, lavande, cacao | ريحة حلوة تشهّي: vanille، lavande — اللي يشمها يسقسي عليها | ⭐
- Burberry Men | homme | Boisée | automne/hiver/printemps | journee | notes: bois, ambre, musc | خشبي وقور: bois، ambre — كاريزما وحضور رجولي | ⭐
- Burberry London | homme | Orientale | automne/hiver | mariage/soiree | notes: cannelle, tabac, cuir | شرقي راقي بـcannelle، tabac، يفوح من بعيد ويخلي أثر | ⭐
- Cacharel Eden | femme | Florale | printemps/été/automne | journee/mariage | notes: melon, lotus, tonka | زهري ناعم وراقي: melon، lotus — أنوثة وأناقة | ⭐⭐
- Cacharel Yes I am glorious | femme | Fruitée | printemps/été/automne | journee/mariage | notes: mandarine, fleur d'oranger, musc | فاكهي حلو بـmandarine، fleur d'oranger، شبابي ومفرح | ⭐⭐
- Calvin Klein CK One Red Edition for him | homme | Aromatique | printemps/été/automne | journee/travail | notes: gingembre, poire, musc | عطري متوازن بـgingembre، poire، يليق بكل وقت | ⭐⭐⭐
- Calvin Klein CK One | unisexe | Hespéridée | printemps/été | journee/travail | notes: citron, thé vert, musc | حمضيات منعشة: citron، thé vert — انتعاش فوري يفيقك | ⭐⭐⭐
- Calvin Klein Liquid Good Euphoria | femme | Orientale | automne/hiver | mariage/soiree | notes: grenade, orchidée, ambre | ريحة شرقية فخمة: grenade، orchidée — تقعد معاك طول الليل | ⭐
- Carolina Herrera La bomba | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: fruits rouges, fleur, vanille | قورماند فاخر بـfruits rouges، fleur، دفء وحلاوة تقعد | ⭐
- Carolina Herrera Ch privée | femme | Orientale | automne/hiver | mariage/soiree | notes: whisky, cuir, vanille | شرقي راقي بـwhisky، cuir، يفوح من بعيد ويخلي أثر | ⭐
- Cartier Déclaration | homme | Boisée | automne/hiver/printemps | journee | notes: cardamome, cèdre, vétiver | ريحة أخشاب راقية بـcardamome، cèdre، ثقة وأناقة | ⭐
- Cartier Pacha | homme | Fougère | printemps/automne | journee/travail | notes: lavande, menthe, santal | فوجير كلاسيكي: lavande، menthe — رجولة خالدة | ⭐⭐
- Cerruti 1881 | homme | Aromatique | printemps/été/automne | journee/travail | notes: romarin, iris, bois | أروماتيك أنيق: romarin، iris — نظافة وانتعاش كلاسي | ⭐⭐⭐
- Chanel Egoiste Platinium | homme | Aromatique | printemps/été/automne | journee/travail | notes: lavande, géranium, santal | عطري متوازن بـlavande، géranium، يليق بكل وقت | ⭐⭐⭐
- Dior Miss Dior Chérie | femme | Fruitée | printemps/été/automne | journee/mariage | notes: fraise, caramel, patchouli | فواكه منعشة: fraise، caramel — حيوية وطاقة طول النهار | ⭐⭐
- Chloe Chloé | femme | Florale | printemps/été/automne | journee/mariage | notes: rose, pivoine, magnolia | زهري ناعم وراقي: rose، pivoine — أنوثة وأناقة | ⭐⭐
- Chloé Love story | femme | Florale | printemps/été/automne | journee/mariage | notes: fleur d'oranger, jasmin, cèdre | ريحة زهور صافية بـfleur d'oranger، jasmin، خفيفة ومريحة | ⭐⭐
- Clinique Happy for men | homme | Hespéridée | printemps/été | journee/travail | notes: citron, gingembre, musc | حمضيات منعشة: citron، gingembre — انتعاش فوري يفيقك | ⭐⭐⭐
- Dove Go fresh apple & White tea | femme | Fruitée | printemps/été/automne | journee/mariage | notes: pomme, thé blanc, musc | فاكهي حلو بـpomme، thé blanc، شبابي ومفرح | ⭐⭐
- Diesel Fuel for Life | homme | Aromatique | printemps/été/automne | journee/travail | notes: anis, framboise, héliotrope | عطري متوازن بـanis، framboise، يليق بكل وقت | ⭐⭐⭐
- Diesel Only the brave | homme | Boisée | automne/hiver/printemps | journee | notes: citron, cuir, benjoin | ريحة أخشاب راقية بـcitron، cuir، ثقة وأناقة | ⭐
- Dolce&Gabbana The One Gold | femme | Orientale | automne/hiver | mariage/soiree | notes: safran, café, vanille | ريحة شرقية فخمة: safran، café — تقعد معاك طول الليل | ⭐
- Dolce&Gabbana The One Royal Night | homme | Orientale | automne/hiver | mariage/soiree | notes: tabac, ambre, épices | شرقي راقي بـtabac، ambre، يفوح من بعيد ويخلي أثر | ⭐
- Dolce&Gabbana Light blue italian zest | femme | Hespéridée | printemps/été | journee/travail | notes: cédrat, pomme, musc | حمضيات منعشة: cédrat، pomme — انتعاش فوري يفيقك | ⭐⭐⭐ BEST
- Dolce&Gabbana Femme | femme | Orientale | automne/hiver | mariage/soiree | notes: mandarine, jasmin, vanille | شرقي راقي بـmandarine، jasmin، يفوح من بعيد ويخلي أثر | ⭐
- Dolce&Gabbana The Only One | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: violette, café, vanille | ريحة حلوة تشهّي: violette، café — اللي يشمها يسقسي عليها | ⭐
- Dolce&Gabbana L'impératrice | femme | Fruitée | printemps/été/automne | journee/mariage | notes: kiwi, pastèque, musc | فاكهي حلو بـkiwi، pastèque، شبابي ومفرح | ⭐⭐ BEST
- Dolce&Gabbana L'impératrice Royale | femme | Fruitée | printemps/été/automne | journee/mariage | notes: fruits exotiques, fleurs, musc | فاكهي حلو بـfruits exotiques، fleurs، شبابي ومفرح | ⭐⭐ BEST
- Dolce&Gabbana King | homme | Hespéridée | printemps/été | journee/travail | notes: bergamote, cardamome, cèdre | حمضيات منعشة: bergamote، cardamome — انتعاش فوري يفيقك | ⭐⭐⭐
- Dior Homme Parfum | homme | Cuir | automne/hiver | mariage/soiree | notes: iris, cuir, santal | جلدي فخم: iris، cuir — قوة وفخامة ما تتنساش | ⭐
- Dior Intense | homme | Poudrée | printemps/automne/hiver | journee/mariage | notes: iris, poire, vétiver | بودري ناعم: iris، poire — رقة وأناقة قديمة | ⭐⭐
- Dior Gris montaigne | unisexe | Florale | printemps/été/automne | journee/mariage | notes: bergamote, rose, patchouli | زهري ناعم وراقي: bergamote، rose — أنوثة وأناقة | ⭐⭐
- Dior Addict | femme | Orientale | automne/hiver | mariage/soiree | notes: vanille, fleur d'oranger, bois | شرقي راقي بـvanille، fleur d'oranger، يفوح من بعيد ويخلي أثر | ⭐
- Elie Saab Girl of now | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: pistache, amande, fleur d'oranger | ريحة حلوة تشهّي: pistache، amande — اللي يشمها يسقسي عليها | ⭐
- Escada Candy Love | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: bonbon, fruits, vanille | ريحة حلوة تشهّي: bonbon، fruits — اللي يشمها يسقسي عليها | ⭐
- Escada Rockin Rio | femme | Fruitée | printemps/été/automne | journee/mariage | notes: fruits tropicaux, coco, musc | فواكه منعشة: fruits tropicaux، coco — حيوية وطاقة طول النهار | ⭐⭐
- Escada Fiesta Carioca | femme | Fruitée | printemps/été/automne | journee/mariage | notes: passion, pêche, ambre | فاكهي حلو بـpassion، pêche، شبابي ومفرح | ⭐
- Escada Taj sunset | femme | Fruitée | printemps/été/automne | journee/mariage | notes: mangue, nectarine, coco | فاكهي حلو بـmangue، nectarine، شبابي ومفرح | ⭐⭐
- Escada Moon Sparkle | femme | Fruitée | printemps/été/automne | journee/mariage | notes: fraise, framboise, musc | فاكهي حلو بـfraise، framboise، شبابي ومفرح | ⭐⭐
- Escada Flora del Sol | femme | Fruitée | printemps/été/automne | journee/mariage | notes: agrumes, fleurs, fruits | فاكهي حلو بـagrumes، fleurs، شبابي ومفرح | ⭐⭐
- Ex Nihilo Blue Talisman | unisexe | Hespéridée | printemps/été | journee/travail | notes: bergamote, gingembre, ambre | حمضيات منعشة: bergamote، gingembre — انتعاش فوري يفيقك | ⭐
- Franck Olivier In Pink | femme | Florale | printemps/été/automne | journee/mariage | notes: fruits rouges, fleurs, musc | ريحة زهور صافية بـfruits rouges، fleurs، خفيفة ومريحة | ⭐⭐
- Franck Olivier Eau de Passion | femme | Florale | printemps/été/automne | journee/mariage | notes: fleurs blanches, fruits, musc | ريحة زهور صافية بـfleurs blanches، fruits، خفيفة ومريحة | ⭐⭐
- Franck Olivier Sun java White | femme | Florale | printemps/été/automne | journee/mariage | notes: fleur d'oranger, ylang, vanille | زهري ناعم وراقي: fleur d'oranger، ylang — أنوثة وأناقة | ⭐⭐
- Franck Olivier Sun java Black | homme | Orientale | automne/hiver | mariage/soiree | notes: épices, ambre, bois | شرقي راقي بـépices، ambre، يفوح من بعيد ويخلي أثر | ⭐
- Franck Olivier Miss Franck Olivier | femme | Fruitée | printemps/été/automne | journee/mariage | notes: fruits, fleurs, musc | فواكه منعشة: fruits، fleurs — حيوية وطاقة طول النهار | ⭐⭐
- Frédéric Malle Acne Studio | unisexe | Musquée | printemps/été/automne/hiver | journee/mariage | notes: musc, aldéhydes, ambrette | مسكي نظيف: musc، aldéhydes — نعومة وطهارة | ⭐
- Givenchy Gentlemen | homme | Boisée | automne/hiver/printemps | journee | notes: iris, patchouli, vétiver | خشبي وقور: iris، patchouli — كاريزما وحضور رجولي | ⭐
- Gucci Envy me | femme | Fruitée | printemps/été/automne | journee/mariage | notes: litchi, grenade, pivoine | فواكه منعشة: litchi، grenade — حيوية وطاقة طول النهار | ⭐⭐
- Gucci Bambo | femme | Florale | printemps/été/automne | journee/mariage | notes: ylang, lys, santal | ريحة زهور صافية بـylang، lys، خفيفة ومريحة | ⭐⭐
- Gucci Bloom | femme | Florale | printemps/été/automne | journee/mariage | notes: tubéreuse, jasmin, iris | ريحة زهور صافية بـtubéreuse، jasmin، خفيفة ومريحة | ⭐⭐
- Gucci Flora | femme | Florale | printemps/été/automne | journee/mariage | notes: pivoine, rose, santal | ريحة زهور صافية بـpivoine، rose، خفيفة ومريحة | ⭐⭐
- Gucci Homme | homme | Boisée | automne/hiver/printemps | journee | notes: bergamote, cuir, ambre | خشبي وقور: bergamote، cuir — كاريزما وحضور رجولي | ⭐
- Hugo Boss Boss orange | femme | Fruitée | printemps/été/automne | journee/mariage | notes: pomme, fleurs blanches, vanille | فاكهي حلو بـpomme، fleurs blanches، شبابي ومفرح | ⭐⭐
- Hugo Boss Orange | homme | Boisée | automne/hiver/printemps | journee | notes: pomme, épices, vanille | خشبي وقور: pomme، épices — كاريزما وحضور رجولي | ⭐
- Jimmy Choo I want choo | femme | Florale | printemps/été/automne | journee/mariage | notes: jasmin, pêche, vanille | زهري ناعم وراقي: jasmin، pêche — أنوثة وأناقة | ⭐⭐
- Kenzo Jeux d'Amour | femme | Fruitée | printemps/été/automne | journee/mariage | notes: mangue, rose, musc | فواكه منعشة: mangue، rose — حيوية وطاقة طول النهار | ⭐⭐
- Kenzo Flower | femme | Poudrée | printemps/automne/hiver | journee/mariage | notes: violette, rose, vanille | ريحة بودرة راقية بـviolette، rose، نعومة تقعد | ⭐⭐
- Lacoste Légère | femme | Florale | printemps/été/automne | journee/mariage | notes: pivoine, jasmin, musc | ريحة زهور صافية بـpivoine، jasmin، خفيفة ومريحة | ⭐⭐
- Lacoste Panach | homme | Fougère | printemps/automne | journee/travail | notes: lavande, mousse, bois | عشبي أنيق بـlavande، mousse، نظافة وثقة | ⭐⭐
- Lacoste Booster | homme | Aromatique | printemps/été/automne | journee/travail | notes: agrumes, gingembre, musc | أروماتيك أنيق: agrumes، gingembre — نظافة وانتعاش كلاسي | ⭐⭐⭐
- Lacoste Challenge | homme | Hespéridée | printemps/été | journee/travail | notes: mandarine, gingembre, teck | حمضيات منعشة: mandarine، gingembre — انتعاش فوري يفيقك | ⭐⭐⭐
- Lancome Trésor Midnight rose | femme | Florale | printemps/été/automne | journee/mariage | notes: framboise, rose, musc | ريحة زهور صافية بـframboise، rose، خفيفة ومريحة | ⭐⭐
- Lanvin Oxygen | femme | Florale | printemps/été/automne | journee/mariage | notes: fleurs blanches, musc, aquatique | زهري ناعم وراقي: fleurs blanches، musc — أنوثة وأناقة | ⭐⭐
- Lanvin Modern Princess | femme | Fruitée | printemps/été/automne | journee/mariage | notes: pomme, jasmin, vanille | فاكهي حلو بـpomme، jasmin، شبابي ومفرح | ⭐⭐
- Laverne Sense | femme | Musquée | printemps/été/automne/hiver | journee/mariage | notes: musc blanc, fleurs, poudré | ريحة مسك صافية بـmusc blanc، fleurs، هدوء ونقاء | ⭐
- Mancera Black Vanille | unisexe | Gourmande | automne/hiver/printemps | mariage/soiree | notes: vanille, fruits, oud | قورماند فاخر بـvanille، fruits، دفء وحلاوة تقعد | ⭐
- Narciso Rodriguez Poudree | femme | Musquée | printemps/été/automne/hiver | journee/mariage | notes: musc, rose, poudré | مسكي نظيف: musc، rose — نعومة وطهارة | ⭐
- Narciso Rodriguez Safran Musc | femme | Musquée | printemps/été/automne/hiver | journee/mariage | notes: safran, musc, ambre | ريحة مسك صافية بـsafran، musc، هدوء ونقاء | ⭐
- Nikos Sculpture | homme | Aromatique | printemps/été/automne | journee/travail | notes: agrumes, sauge, bois | أروماتيك أنيق: agrumes، sauge — نظافة وانتعاش كلاسي | ⭐⭐⭐
- Nina Ricci L'extase | femme | Florale | printemps/été/automne | journee/mariage | notes: rose, musc, ambre | زهري ناعم وراقي: rose، musc — أنوثة وأناقة | ⭐
- Paco Rabanne One milion Lucky | homme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: noisette, prune, miel | قورماند فاخر بـnoisette، prune، دفء وحلاوة تقعد | ⭐
- Paco Rabanne One million Elixir | homme | Orientale | automne/hiver | mariage/soiree | notes: cuir, cacao, bois | شرقي راقي بـcuir، cacao، يفوح من بعيد ويخلي أثر | ⭐ BEST
- Paco Rabanne Strong Me | homme | Orientale | automne/hiver | mariage/soiree | notes: gingembre, ambre, tonka | شرقي راقي بـgingembre، ambre، يفوح من بعيد ويخلي أثر | ⭐
- Paco Rabanne Black XS L'excès | homme | Orientale | automne/hiver | mariage/soiree | notes: café, cannelle, ambre | شرقي راقي بـcafé، cannelle، يفوح من بعيد ويخلي أثر | ⭐
- Paco Rabanne Erotic me | femme | Orientale | automne/hiver | mariage/soiree | notes: fruits, fleurs, ambre | ريحة شرقية فخمة: fruits، fleurs — تقعد معاك طول الليل | ⭐
- Rave Now | unisexe | Orientale | automne/hiver | mariage/soiree | notes: oud, fruits, ambre | ريحة شرقية فخمة: oud، fruits — تقعد معاك طول الليل | ⭐
- Sospiro | unisexe | Fruitée | printemps/été/automne | journee/mariage | notes: fruits, fleurs, musc | فاكهي حلو بـfruits، fleurs، شبابي ومفرح | ⭐⭐
- SHL 777 God of Fire | unisexe | Orientale | automne/hiver | mariage/soiree | notes: safran, miel, oud | ريحة شرقية فخمة: safran، miel — تقعد معاك طول الليل | ⭐
- Tiziana Terenzi Kirke | unisexe | Fruitée | printemps/été/automne | journee/mariage | notes: cassis, framboise, musc | فواكه منعشة: cassis، framboise — حيوية وطاقة طول النهار | ⭐⭐
- Thierry Mugler Alien | femme | Florale | printemps/été/automne | journee/mariage | notes: jasmin, ambre, bois | زهري ناعم وراقي: jasmin، ambre — أنوثة وأناقة | ⭐
- Thierry Mugler Alien Goddess Supra | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: jasmin, vanille bourbon, fève tonka | ريحة حلوة تشهّي: jasmin، vanille bourbon — اللي يشمها يسقسي عليها | ⭐
- Valentino Valentina | femme | Florale | printemps/été/automne | journee/mariage | notes: tubéreuse, fraise, ambre | زهري ناعم وراقي: tubéreuse، fraise — أنوثة وأناقة | ⭐
- Valentino Sogno in risso | femme | Florale | printemps/été/automne | journee/mariage | notes: fleurs, fruits, musc | ريحة زهور صافية بـfleurs، fruits، خفيفة ومريحة | ⭐⭐
- Victoria's Secret Bar Vanilla | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: vanille, caramel, musc | ريحة حلوة تشهّي: vanille، caramel — اللي يشمها يسقسي عليها | ⭐
- Victoria's Secret Eau So Sexy | femme | Fruitée | printemps/été/automne | journee/mariage | notes: fruits, fleurs, musc | فاكهي حلو بـfruits، fleurs، شبابي ومفرح | ⭐⭐
- Victoria's Secret Coconut Pink | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: coco, vanille, musc | قورماند فاخر بـcoco، vanille، دفء وحلاوة تقعد | ⭐
- Victoria's Secret Very Sexy | femme | Orientale | automne/hiver | mariage/soiree | notes: vanille noire, orchidée, bois | شرقي راقي بـvanille noire، orchidée، يفوح من بعيد ويخلي أثر | ⭐
- Victoria's Secret Just a kiss | femme | Florale | printemps/été/automne | journee/mariage | notes: pêche, freesia, musc | ريحة زهور صافية بـpêche، freesia، خفيفة ومريحة | ⭐⭐
- Victoria's Secret Wicked | femme | Gourmande | automne/hiver/printemps | mariage/soiree | notes: caramel, jasmin, vanille | ريحة حلوة تشهّي: caramel، jasmin — اللي يشمها يسقسي عليها | ⭐
- Yves Rocher Evidence | femme | Florale | printemps/été/automne | journee/mariage | notes: rose, violette, ambre | زهري ناعم وراقي: rose، violette — أنوثة وأناقة | ⭐
- Yves Rocher Mon Evidence | femme | Florale | printemps/été/automne | journee/mariage | notes: rose, framboise, santal | ريحة زهور صافية بـrose، framboise، خفيفة ومريحة | ⭐⭐
- Yves Rocher Comme une évidence | femme | Florale | printemps/été/automne | journee/mariage | notes: rose, muguet, mousse | ريحة زهور صافية بـrose، muguet، خفيفة ومريحة | ⭐⭐
- Yves Saint Laurent L'Homme Ultime | homme | Boisée | automne/hiver/printemps | journee | notes: pamplemousse, rose, vétiver | خشبي وقور: pamplemousse، rose — كاريزما وحضور رجولي | ⭐
- Yves Saint Laurent Parisienne | femme | Florale | printemps/été/automne | journee/mariage | notes: rose, violette, santal | ريحة زهور صافية بـrose، violette، خفيفة ومريحة | ⭐⭐
- Yves Saint Laurent Cinema | femme | Orientale | automne/hiver | mariage/soiree | notes: ambre, vanille, fleurs | شرقي راقي بـambre، vanille، يفوح من بعيد ويخلي أثر | ⭐
- Yves Saint Laurent Eau de parfum Intense | femme | Florale | printemps/été/automne | journee/mariage | notes: fleurs, ambre, musc | زهري ناعم وراقي: fleurs، ambre — أنوثة وأناقة | ⭐
- Zara Gardenia | femme | Florale | printemps/été/automne | journee/mariage | notes: gardénia, vanille, musc | ريحة زهور صافية بـgardénia، vanille، خفيفة ومريحة | ⭐⭐
- Zara Orchid | femme | Florale | printemps/été/automne | journee/mariage | notes: orchidée, vanille, musc | زهري ناعم وراقي: orchidée، vanille — أنوثة وأناقة | ⭐⭐
- Zara WonderRose | femme | Fruitée | printemps/été/automne | journee/mariage | notes: rose, fruits rouges, musc | فاكهي حلو بـrose، fruits rouges، شبابي ومفرح | ⭐⭐
- Zara Rose | femme | Florale | printemps/été/automne | journee/mariage | notes: rose, fruits, musc | زهري ناعم وراقي: rose، fruits — أنوثة وأناقة | ⭐⭐
- Zara Black Ambre | femme | Orientale | automne/hiver | mariage/soiree | notes: ambre, vanille, épices | ريحة شرقية فخمة: ambre، vanille — تقعد معاك طول الليل | ⭐
- Zara Tobacco | homme | Orientale | automne/hiver | mariage/soiree | notes: tabac, épices, bois | شرقي راقي بـtabac، épices، يفوح من بعيد ويخلي أثر | ⭐
- Zara Sport | homme | Aromatique | printemps/été/automne | journee/travail | notes: agrumes, menthe, bois | أروماتيك أنيق: agrumes، menthe — نظافة وانتعاش كلاسي | ⭐⭐⭐
- Paco Rabanne Ultraviolet | homme | Orientale | automne/hiver | mariage/soiree | notes: menthe, vétiver, ambre | ريحة شرقية فخمة: menthe، vétiver — تقعد معاك طول الليل | ⭐
- Mélange Royal Amini | unisexe | Orientale | automne/hiver | mariage/soiree | notes: oud, vanille, ambre | خلطة أميني الملكية: عود وفانيلا وعنبر — فخامة ما كاينش كيفها 👑 | ⭐
- Amini Mélange Sultan | homme | Orientale | automne/hiver | mariage/soiree | notes: safran, rose, oud | خلطة السلطان: زعفران وورد وعود — حضور شرقي قوي | ⭐
- Amini Mélange Sahra | femme | Gourmande | automne/hiver/printemps | soiree/mariage | notes: vanille, caramel, musc | خلطة سهرة: فانيلا وكراميل ومسك — حلاوة تسحر ✨ | ⭐
- Amini Mélange Fraîcheur | unisexe | Hespéridée | printemps/été | journee/travail | notes: agrumes, menthe, musc blanc | خلطة الانتعاش: حمضيات ونعناع ومسك أبيض — فريشة الصيف 🌊 | ⭐⭐
- Amini Crème de corps | unisexe | Soin parfumé | printemps/été/automne/hiver | journee | notes: huile de noix, sans odeur, hydratante, fixe le parfum | كريم الجسم بزيت الجوز، بلا ريحة، يثبّت العطر مدة أطول، ما يلزقش ويرطّب 💛 | ⭐⭐`;

const SYSTEME = `Tu es le conseiller parfum officiel d'Amini Perfumes, une parfumerie située à L'Arbaa (Blida, Algérie).
Tu t'exprimes dans un français clair, courtois et professionnel. Tu vouvoies le client. Ton ton est élégant, posé et expert — comme un conseiller de boutique haut de gamme. Tu peux glisser un mot d'accueil en arabe si le client écrit en arabe, mais tu restes toujours professionnel et jamais trop familier.

RÈGLES STRICTES — À RESPECTER ABSOLUMENT :
1. Tu recommandes UNIQUEMENT des parfums présents dans la liste ci-dessous. Jamais un parfum hors liste.
2. **GENRE — RÈGLE ABSOLUE, AUCUNE EXCEPTION** :
   - Avant chaque suggestion, vérifie le champ "genre" dans le catalogue (femme, homme, ou unisexe).
   - Si le client demande "pour femme", "pour ma femme", "pour elle", "ma fille", "ma maman", "pour mariage femme", ou tout indicateur féminin → tu PROPOSES UNIQUEMENT des parfums marqués "femme" ou "unisexe". JAMAIS un seul parfum "homme", même si l'odeur correspond.
   - Si le client demande "pour homme", "pour moi" (et le client a un prénom masculin), "pour mon mari", "pour mon frère" → UNIQUEMENT "homme" ou "unisexe". JAMAIS un seul parfum "femme".
   - Si le genre n'est pas spécifié, propose un mix équilibré ou demande poliment.
   - ❌ INTERDIT : suggérer "Versace Eros Pour Homme" (homme) pour une demande "femme". Le mot "Pour Homme" dans le nom = parfum homme, exclu pour les demandes femme.
   - ❌ INTERDIT : suggérer "Dior J'adore" (femme) pour une demande "homme".
3. **FAMILLE / NOTES — RÈGLE ABSOLUE** : Si le client demande explicitement une famille olfactive (boisé, floral, oriental, frais, sucré, citronné, gourmand, épicé, etc.) → CHAQUE parfum suggéré DOIT contenir cette famille dans sa description du catalogue. Pas "presque" — STRICTEMENT.
   - ❌ INTERDIT : suggérer un parfum "oriental" si le client demande "sucré" (oriental ≠ sucré, sauf si les deux familles sont listées dans la même ligne)
   - ❌ INTERDIT : suggérer "Kajal Ruby" (oriental/sucré) pour "frais" — relis le catalogue, si "frais" n'est pas dans la ligne, c'est NON
   - ✅ Si la famille demandée est "sucré" → cherche dans le catalogue les lignes avec "sucré" ou "gourmand" dans leur description. Rien d'autre.
   - ✅ Si la famille demandée est "frais" → cherche les lignes avec "frais", "citronné" ou "aquatique"

4. **SAISON — RÈGLE ABSOLUE** : Si le client mentionne une saison (été, hiver, printemps, automne) → tes suggestions DOIVENT contenir cette saison dans leur catalogue.
   - ❌ INTERDIT : suggérer un parfum marqué uniquement "automne/hiver" pour une demande "été" — les parfums lourds/orientaux/gourmands sont souvent réservés à l'hiver, ne JAMAIS les proposer pour l'été
   - ❌ Exemple : "Kajal Ruby" listé "automne/hiver" → INTERDIT pour une demande "été"
   - ✅ Pour "été" → cherche les lignes contenant "été", typiquement frais, citronné, aquatique, floral léger
   - ✅ Pour "hiver" → cherche les lignes contenant "hiver", typiquement oriental, gourmand, épicé, boisé profond

5. **OCCASION** : Si le client mentionne mariage, soirée, bureau, quotidien → respecte aussi cette contrainte.

6. **DEMANDE COMBINÉE** (le cas le plus fréquent) : Si le client demande PLUSIEURS critères en même temps (ex : "parfum sucré pour femme été"), TOUS les critères doivent être respectés ENSEMBLE par chaque parfum suggéré :
   - genre = femme ou unisexe ✓
   - famille contient "sucré" ou "gourmand" ✓
   - saison contient "été" ou "p/e" ✓
   - Si tu trouves moins de 2 parfums qui matchent TOUS les critères, dis-le honnêtement au client : "Je trouve peu de parfums qui matchent exactement tous vos critères. Voici les plus proches : ..."

ALGORITHME DE VÉRIFICATION (obligatoire avant chaque réponse) :
1. Lis la demande du client. Extrais : genre demandé, famille demandée, saison demandée, occasion demandée
2. Pour chaque parfum candidat dans le catalogue :
   a) Le genre correspond-il ? (femme/homme/unisexe vs demande)
   b) La famille demandée est-elle dans la description ?
   c) La saison demandée est-elle listée ?
   d) L'occasion demandée est-elle listée ?
3. Si TOUS les critères sont remplis → candidat valide. Sinon → exclus.
4. Choisis 2-3 parfums parmi les candidats valides UNIQUEMENT. Jamais un parfum hors candidat valide.
5. Si moins de 2 candidats valides → dis-le honnêtement au client.

PRÉSENTATION :
- 2 à 3 parfums maximum par réponse. Concis et structuré.
- **NOM EXACT OBLIGATOIRE** : Tu écris le parfum EXACTEMENT comme dans le catalogue (avec la marque complète au début, jamais d'abréviation). Par exemple : "Louis Vuitton Imagination" (jamais "LV Imagination"), "Yves Saint Laurent Black Opium" (jamais "YSL Black Opium").
- Format obligatoire de chaque suggestion : « 🌸 *Nom Exact du Catalogue* — explication en une phrase »
- Pour chaque parfum : une phrase claire expliquant pourquoi il convient.
- N'indique pas de prix précis (cela dépend du flacon) : invite le client à cliquer sur le parfum pour composer sa commande.
- Termine toujours tes phrases. Ne coupe jamais une réponse au milieu.
- Reste strictement sur le sujet des parfums. Si on te demande autre chose, redirige poliment vers les parfums.

EXEMPLE de bonne réponse pour "parfum frais pour femme été" :
"Pour une fragrance fraîche et estivale, je vous propose :
🌸 *Dior J'adore Lumière* — un floral lumineux et citronné, parfait pour les journées ensoleillées.
🌸 *Armani My Way* — un floral délicat aux accents frais, idéal au quotidien en été."

═══════════════ ART DU CONSEIL — MISE EN VALEUR DU PARFUM ═══════════════
Tu n'es pas un robot qui liste des parfums. Tu es un CONSEILLER PASSIONNÉ qui FAIT VENDRE en racontant l'histoire de chaque fragrance.

Pour CHAQUE parfum que tu suggères, tu DOIS rédiger une mini-description (1-2 phrases) qui :
1. **Évoque les notes principales** (extraites du champ "notes:" du catalogue, traduites de l'arabe en français — ex: نعناع → menthe, ليمون → citron, ورد → rose, فانيليا → vanille, عود → oud, مسك → musc, تفاح → pomme, برغموت → bergamote, إيلانغ → ylang-ylang, ياسمين → jasmin, تبغ → tabac, جلد → cuir)
2. **Capture l'effet/l'émotion** (en t'inspirant du champ darja qui contient la description vendeuse en argot algérien — ex: "ناعم فاكهي" = doux et fruité, "أيقوني" = iconique, "أناقة مطلقة" = élégance absolue, "الناس تعرفه فوراً" = on le reconnaît immédiatement)
3. **Mentionne quand le porter** (occasion ou saison adaptée si le contexte le permet)
4. **Reste élégante et professionnelle** — pas de superlatifs creux comme "incroyable", "merveilleux"; sois précis et évocateur

TON CATALOGUE est ENRICHI. Pour chaque parfum tu vois maintenant :
- nom complet | genre | familles olfactives | saisons | occasions | **notes olfactives en arabe** | **description vendeuse en darja** | ★ tier (3⭐ = best-sellers MEGA / 2⭐ = forts vendeurs / 1⭐ = niche solide) | BEST = top vente confirmé

UTILISE les notes et la darja pour ÉCRIRE TES RÉPONSES. Ne les cite pas brutalement — TRADUIS les notes en français et fais-en une phrase fluide.

EXEMPLE PARFAIT de réponse mise en valeur :
Catalogue ligne : "Chanel Coco Mademoiselle | femme | oriental/floral | printemps/automne/hiver | journee | notes: برتقال، برغموت | أيقوني، الناس تعرفه فوراً | ⭐ BEST"

Réponse :
"🌸 *Chanel Coco Mademoiselle* — Un oriental floral iconique qui ouvre sur une bergamote pétillante et une orange juteuse. C'est LE parfum reconnaissable entre mille, parfait pour la journée du printemps à l'hiver. Un classique qui ne déçoit jamais."

Tu vois la différence ? Tu utilises :
- "بartugال، برغموت" → "bergamote pétillante et orange juteuse"
- "أيقوني، الناس تعرفه فوراً" → "iconique, reconnaissable entre mille"
- "BEST" → "un classique qui ne déçoit jamais"

PRIORITE LES BESTS (⭐⭐⭐ et BEST) si plusieurs candidats matchent, sauf si le client demande quelque chose de plus niche/discret.

CATALOGUE ENRICHI (nom | genre | familles | saisons | occasions | notes:ar | darja vendeuse | tier) :
${CATALOGUE}`;

export default async (req: Request) => {
  const KEY_GEMINI = process.env.GEMINI_API_KEY || "";
  const KEY_MISTRAL = process.env.MISTRAL_API_KEY || "";

  // Test santé : ouvrir l'URL dans le navigateur (GET)
  if (req.method === "GET") {
    return Response.json({
      ok: true,
      fonction: "deployee",
      mistral: KEY_MISTRAL ? "configure" : "absent",
      gemini: KEY_GEMINI ? "configuree" : "absent",
      modele_actif: KEY_MISTRAL ? MODEL_MISTRAL : (KEY_GEMINI ? MODEL_GEMINI : "AUCUN - ajoute MISTRAL_API_KEY ou GEMINI_API_KEY dans Netlify")
    });
  }
  if (req.method !== "POST") {
    return Response.json({ error: "Methode non autorisee" }, { status: 405 });
  }

  if (!KEY_MISTRAL && !KEY_GEMINI) {
    return Response.json({ error: "Aucune cle API configuree. Ajoute MISTRAL_API_KEY (recommande) ou GEMINI_API_KEY dans Netlify." }, { status: 500 });
  }

  let message = "";
  let historique: any[] = [];
  try {
    const b = await req.json();
    message = (b?.message || "").toString().slice(0, 500);
    if (Array.isArray(b?.historique)) historique = b.historique.slice(-6);
  } catch (e) {}
  if (!message.trim()) return Response.json({ error: "Message vide" }, { status: 400 });

  // ═══════════════ PROVIDER 1 : MISTRAL AI (préféré) ═══════════════
  if (KEY_MISTRAL) {
    try {
      const messages: any[] = [{ role: "system", content: SYSTEME }];
      for (const h of historique) {
        if (h?.role && h?.text) {
          messages.push({ role: h.role === "ia" ? "assistant" : "user", content: String(h.text).slice(0, 800) });
        }
      }
      messages.push({ role: "user", content: message });

      const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + KEY_MISTRAL },
        body: JSON.stringify({
          model: MODEL_MISTRAL,
          messages,
          temperature: 0.85,
          max_tokens: 1024,
          top_p: 0.95
        })
      });
      const data: any = await resp.json();
      if (resp.ok) {
        const reply = data?.choices?.[0]?.message?.content || "Je vous prie de m'excuser, pourriez-vous reformuler votre demande ?";
        return Response.json({ reply, provider: "mistral" });
      }
      // Si Mistral échoue et qu'on n'a pas Gemini, on remonte l'erreur
      if (!KEY_GEMINI) {
        return Response.json({ error: "Mistral : " + (data?.message || data?.error?.message || ("erreur " + resp.status)) }, { status: 502 });
      }
      // sinon on tente Gemini en fallback
    } catch (e: any) {
      if (!KEY_GEMINI) return Response.json({ error: "Mistral : " + (e?.message || "erreur connexion") }, { status: 500 });
    }
  }

  // ═══════════════ PROVIDER 2 : GEMINI (fallback) ═══════════════
  if (KEY_GEMINI) {
    const contents: any[] = [];
    for (const h of historique) {
      if (h?.role && h?.text) {
        contents.push({ role: h.role === "ia" ? "model" : "user", parts: [{ text: String(h.text).slice(0, 800) }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const payload = {
      system_instruction: { parts: [{ text: SYSTEME }] },
      contents,
      generationConfig: { temperature: 0.9, maxOutputTokens: 2048, topP: 0.95, thinkingConfig: { thinkingBudget: 0 } }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_GEMINI}:generateContent`;
    const body = JSON.stringify(payload);
    const tentatives = [
      { nom: "x-goog-api-key", url: url, headers: { "Content-Type": "application/json", "x-goog-api-key": KEY_GEMINI } },
      { nom: "Bearer", url: url, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + KEY_GEMINI } },
      { nom: "url-key", url: url + "?key=" + encodeURIComponent(KEY_GEMINI), headers: { "Content-Type": "application/json" } }
    ];

    let dernierErr: any = null;
    for (const t of tentatives) {
      try {
        const resp = await fetch(t.url, { method: "POST", headers: t.headers, body });
        const data: any = await resp.json();
        if (resp.ok) {
          const reply = (data?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text).join("")
            || "Je vous prie de m'excuser, pourriez-vous reformuler votre demande ?";
          return Response.json({ reply, provider: "gemini" });
        }
        const msg = (data?.error?.message || "").toLowerCase();
        const estAuth = resp.status === 401 || resp.status === 403
          || msg.includes("api key") || msg.includes("api_key") || msg.includes("authentication") || msg.includes("unauthorized");
        dernierErr = { status: resp.status, msg: data?.error?.message || ("Erreur Gemini " + resp.status), methode: t.nom };
        if (!estAuth) {
          return Response.json({ error: dernierErr.msg }, { status: 502 });
        }
      } catch (e: any) {
        dernierErr = { status: 500, msg: e?.message || "inconnue", methode: t.nom };
      }
    }
    return Response.json({ error: (dernierErr?.msg || "Cle Gemini invalide") + " (3 methodes essayees)" }, { status: 502 });
  }

  return Response.json({ error: "Aucune cle valide" }, { status: 500 });
};
