import type { OtherLocale } from "./locales";

type A = { title: string; excerpt: string; content: string };

/** Article translations keyed by slug. Untranslated articles are hidden in that language. */
export const ARTICLE_I18N: Record<string, Record<OtherLocale, A>> = {
  "khavass-zafaran": {
    en: {
      title: "Health Benefits of Saffron",
      excerpt: "A short look at how authentic Qaen saffron supports mood, digestion and the immune system.",
      content: `## Introduction

Saffron is one of the most precious spices in the world and has held a special place in traditional Persian medicine for centuries. Beyond its unique taste and aroma, this red gold has many health benefits.

## Key benefits

- **Better mood:** regular saffron use helps lift the mood.
- **Digestion:** saffron helps with bloating and supports healthy digestion.
- **Strong antioxidant:** crocin and safranal protect cells from damage.

## Daily amount

30–50 mg of authentic saffron a day is recommended for adults. Too much may cause side effects.

### Final tip

To get the real benefits, always use authentic, high-quality saffron.`,
    },
    tr: {
      title: "Safranın Sağlığa Faydaları",
      excerpt: "Orijinal Kayen safranının ruh hali, sindirim ve bağışıklık sistemine faydalarına kısa bir bakış.",
      content: `## Giriş

Safran dünyanın en değerli baharatlarından biridir ve yüzyıllardır geleneksel İran tıbbında özel bir yere sahiptir. Eşsiz tadı ve kokusunun yanında bu kırmızı altının birçok faydası vardır.

## Başlıca faydalar

- **Ruh halini iyileştirir:** düzenli safran tüketimi moral yükseltir.
- **Sindirime yardımcı:** şişkinliği azaltır, sindirimi destekler.
- **Güçlü antioksidan:** krosin ve safranal hücreleri hasara karşı korur.

## Günlük miktar

Yetişkinler için günde 30–50 mg orijinal safran önerilir. Aşırı tüketim yan etkilere yol açabilir.

### Son ipucu

Gerçek faydalar için mutlaka orijinal ve kaliteli safran kullanın.`,
    },
    ar: {
      title: "فوائد الزعفران للصحة",
      excerpt: "نظرة سريعة على فوائد زعفران قاين الأصلي لتحسين المزاج والهضم وتقوية المناعة.",
      content: `## مقدمة

الزعفران من أثمن التوابل في العالم، وله مكانة خاصة في الطب الإيراني التقليدي منذ قرون. وإلى جانب طعمه ورائحته الفريدين، يتمتع هذا الذهب الأحمر بفوائد صحية كثيرة.

## أهم الفوائد

- **تحسين المزاج:** يساعد تناول الزعفران بانتظام على تحسين المزاج.
- **دعم الهضم:** يخفف الانتفاخ ويحسن عمل الجهاز الهضمي.
- **مضاد أكسدة قوي:** يحمي الكروسين والسافرانال الخلايا من التلف.

## الكمية اليومية

يُنصح البالغون بتناول 30 إلى 50 ملغ من الزعفران الأصلي يومياً. الإفراط قد يسبب آثاراً جانبية.

### نصيحة أخيرة

للاستفادة الحقيقية احرص دائماً على استخدام زعفران أصلي عالي الجودة.`,
    },
  },
  "tashkhis-zafaran-asl": {
    en: {
      title: "How to Tell Real Saffron from Fake",
      excerpt: "A simple guide to telling authentic Qaen saffron apart from counterfeits on the market.",
      content: `## The problem of fake saffron

Because saffron is expensive, there are many fakes on the market. A few simple checks can keep you from a bad purchase.

## Simple tests

1. **Cold water test:** real saffron releases its colour slowly in cold water, not all at once.
2. **Smell:** real saffron smells warm and slightly bitter, not sweet.
3. **Thread shape:** real saffron threads are thin and flare into a trumpet shape at the end.

## Where to buy

The best way is to buy directly from a trusted producer in the Qaen region. With over three generations of experience, Khajavi Saffron guarantees authenticity.`,
    },
    tr: {
      title: "Gerçek Safran Nasıl Anlaşılır?",
      excerpt: "Orijinal Kayen safranını piyasadaki sahtelerinden ayırmak için basit bir rehber.",
      content: `## Safranda sahtecilik sorunu

Safran pahalı olduğu için piyasada çok sayıda sahtesi var. Birkaç basit kontrol sizi yanlış alışverişten korur.

## Basit testler

1. **Soğuk su testi:** gerçek safran soğuk suda rengini yavaşça verir, bir anda değil.
2. **Koku:** gerçek safran sıcak ve hafif acı kokar, tatlı değil.
3. **Tel şekli:** gerçek safran telleri ince olup ucu huni gibi genişler.

## Nereden alınmalı?

En iyisi Kayen bölgesindeki güvenilir bir üreticiden doğrudan almaktır. Üç kuşaktan fazla deneyimiyle Khajavi Safran orijinalliği garanti eder.`,
    },
    ar: {
      title: "كيف تميّز الزعفران الأصلي؟",
      excerpt: "دليل بسيط لتمييز زعفران قاين الأصلي عن الأنواع المغشوشة في السوق.",
      content: `## مشكلة الغش في الزعفران

بسبب ارتفاع سعر الزعفران تنتشر في السوق أنواع مغشوشة كثيرة. بعض النصائح البسيطة تحميك من الشراء الخاطئ.

## اختبارات بسيطة

1. **اختبار الماء البارد:** يطلق الزعفران الأصلي لونه ببطء في الماء البارد، لا دفعة واحدة.
2. **الرائحة:** رائحة الزعفران الأصلي دافئة ومائلة للمرارة، لا حلوة.
3. **شكل الخيط:** خيوط الزعفران الأصلي رفيعة وتتسع في طرفها على شكل قمع.

## من أين تشتري؟

الأفضل هو الشراء مباشرة من منتج موثوق في منطقة قاين. بخبرة تمتد لأكثر من ثلاثة أجيال، يضمن زعفران خواجوي أصالة المنتج.`,
    },
  },
  "tarz-dam-kardan-zafaran": {
    en: {
      title: "How to Brew Saffron Properly",
      excerpt: "Brew saffron the right way to multiply its colour, aroma and flavour and get its full benefits.",
      content: `## Why brewing matters

Many people don't brew saffron correctly, so it gives little colour and its aroma never comes out. A few simple steps give the best result.

## Steps

1. **Grind:** grind the threads in a porcelain mortar with a few grains of sugar or salt until fully powdered.
2. **Hot water:** pour 3–4 tablespoons of boiling water over the powder.
3. **Steep:** cover and let it steep for 20–30 minutes.

## Golden tips

- Never put saffron directly over heat.
- Use a porcelain or glass container, not metal.
- Brewed saffron keeps in the fridge for up to 48 hours.`,
    },
    tr: {
      title: "Safran Doğru Nasıl Demlenir?",
      excerpt: "Safranı doğru demleyerek rengini, kokusunu ve tadını katlayın ve faydalarından tam yararlanın.",
      content: `## Demleme neden önemli?

Pek çok kişi safranı doğru demlemez; bu yüzden ne yeterli renk verir ne de kokusu açığa çıkar. Birkaç basit adımla en iyi sonucu alabilirsiniz.

## Adımlar

1. **Öğütme:** telleri porselen havanda birkaç tane şeker veya tuzla toz olana kadar öğütün.
2. **Sıcak su:** tozun üzerine 3–4 yemek kaşığı kaynar su dökün.
3. **Demleme:** kabın ağzını kapatın ve 20–30 dakika demlenmeye bırakın.

## Altın ipuçları

- Safranı asla doğrudan ateşe koymayın.
- Metal değil, porselen veya cam kap kullanın.
- Demlenmiş safran buzdolabında 48 saate kadar saklanabilir.`,
    },
    ar: {
      title: "الطريقة الصحيحة لنقع الزعفران",
      excerpt: "بالطريقة الصحيحة لنقع الزعفران تضاعف لونه ورائحته وطعمه وتستفيد من خصائصه بالكامل.",
      content: `## لماذا طريقة النقع مهمة؟

كثيرون لا ينقعون الزعفران بشكل صحيح، فلا يعطي لوناً كافياً ولا تنطلق رائحته. ببعض الخطوات البسيطة تحصل على أفضل نتيجة.

## الخطوات

1. **الطحن:** اطحن الخيوط في هاون خزفي مع بضع حبات من السكر أو الملح حتى تصبح مسحوقاً.
2. **الماء المغلي:** اسكب 3 إلى 4 ملاعق كبيرة من الماء المغلي على المسحوق.
3. **النقع:** أغلق الوعاء واتركه 20 إلى 30 دقيقة.

## نصائح ذهبية

- لا تضع الزعفران مباشرة على النار.
- استخدم وعاءً خزفياً أو زجاجياً لا معدنياً.
- يمكن حفظ الزعفران المنقوع في الثلاجة حتى 48 ساعة.`,
    },
  },
  "negahdari-zafaran": {
    en: {
      title: "How to Store Saffron at Home",
      excerpt: "Keep saffron's aroma and colour for months, even years, with a few simple rules.",
      content: `## Saffron's enemies

Three things destroy saffron quality: **light**, **moisture** and **heat**. Control all three for long-term storage.

## Best conditions

- **Container:** an airtight, completely dry glass jar, preferably dark.
- **Place:** away from direct sunlight, in a cool, dry cupboard.
- **Temperature:** 15–20 °C is ideal.

## Should saffron go in the fridge?

Only if the container is completely airtight; otherwise moisture will damage it.

## Shelf life

Stored correctly, saffron keeps its properties and aroma for up to **2 years**.`,
    },
    tr: {
      title: "Safran Evde Nasıl Saklanır?",
      excerpt: "Birkaç basit kuralla safranın kokusunu ve rengini aylarca, hatta yıllarca koruyun.",
      content: `## Safranın düşmanları

Safranın kalitesini üç şey bozar: **ışık**, **nem** ve **ısı**. Uzun süreli saklama için üçünü de kontrol edin.

## En iyi koşullar

- **Kap:** hava geçirmez, tamamen kuru, tercihen koyu renkli cam kavanoz.
- **Yer:** doğrudan güneş ışığından uzak, serin ve kuru bir dolap.
- **Sıcaklık:** 15–20 °C idealdir.

## Buzdolabına konmalı mı?

Yalnızca kap tamamen hava geçirmezse; aksi halde nem safrana zarar verir.

## Raf ömrü

Doğru saklanan safran **2 yıla** kadar özelliklerini ve kokusunu korur.`,
    },
    ar: {
      title: "الطريقة الصحيحة لحفظ الزعفران في المنزل",
      excerpt: "حافظ على رائحة الزعفران ولونه لأشهر بل لسنوات باتباع بعض القواعد البسيطة.",
      content: `## أعداء الزعفران

ثلاثة عوامل تفسد جودة الزعفران: **الضوء** و**الرطوبة** و**الحرارة**. للحفظ الطويل يجب التحكم فيها جميعاً.

## أفضل ظروف الحفظ

- **الوعاء:** برطمان زجاجي محكم وجاف تماماً، ويفضل أن يكون داكناً.
- **المكان:** بعيداً عن أشعة الشمس المباشرة، في خزانة باردة وجافة.
- **الحرارة:** بين 15 و20 درجة مئوية هي المثالية.

## هل نضع الزعفران في الثلاجة؟

فقط إذا كان الوعاء محكم الإغلاق تماماً، وإلا فإن الرطوبة ستضره.

## مدة الصلاحية

مع الحفظ الصحيح يحتفظ الزعفران بخصائصه ورائحته حتى **سنتين**.`,
    },
  },
  "zafaran-dar-ashpazi-irani": {
    en: {
      title: "Saffron in Persian Cooking",
      excerpt: "From saffron rice to sholeh zard — the unique place of saffron on the Persian table.",
      content: `## Saffron, the soul of Persian cooking

There is hardly a festive Persian dish without saffron. This precious spice gives food a unique colour, aroma and flavour.

## Most popular dishes

- **Saffron rice (chelow):** the crown of the Persian table; a few spoonfuls of brewed saffron over rice make it festive.
- **Sholeh zard:** a traditional rice pudding that is meaningless without saffron.
- **Tahchin:** saffron, yoghurt and chicken or meat baked with rice.
- **Saffron halva:** a fragrant dessert for gatherings.

## Chef's tip

Always add saffron at the end of cooking so high heat doesn't destroy its aroma.`,
    },
    tr: {
      title: "İran Mutfağında Safran",
      excerpt: "Safranlı pilavdan şolezerde — safranın İran sofrasındaki eşsiz yeri.",
      content: `## Safran, İran mutfağının ruhu

Safransız bir İran şölen yemeği bulmak zordur. Bu değerli baharat yemeklere eşsiz bir renk, koku ve tat verir.

## En sevilen yemekler

- **Safranlı pilav (çelov):** İran sofrasının tacı; pilavın üzerine birkaç kaşık demlenmiş safran ona bayram havası katar.
- **Şolezerd:** safransız düşünülemeyen geleneksel pirinç tatlısı.
- **Tahçin:** safran, yoğurt ve tavuk ya da etle fırınlanan pilav.
- **Safranlı helva:** toplantıların mis kokulu tatlısı.

## Şefin ipucu

Yüksek ısı kokusunu yok etmesin diye safranı her zaman pişirmenin sonunda ekleyin.`,
    },
    ar: {
      title: "استخدامات الزعفران في المطبخ الإيراني",
      excerpt: "من الأرز بالزعفران إلى الشله زرد؛ نظرة على مكانة الزعفران الفريدة على المائدة الإيرانية.",
      content: `## الزعفران روح المطبخ الإيراني

يندر أن تجد طبقاً إيرانياً للمناسبات بلا زعفران. فهذا التابل الثمين يمنح الطعام لوناً ورائحة وطعماً فريداً.

## أشهر الأطباق

- **الأرز بالزعفران (چلو):** تاج المائدة الإيرانية؛ بضع ملاعق من الزعفران المنقوع فوق الأرز تمنحه مظهراً فاخراً.
- **شله زرد:** حلوى أرز تقليدية لا معنى لها بلا زعفران.
- **ته چين:** أرز مخبوز بالزعفران واللبن والدجاج أو اللحم.
- **حلوى الزعفران:** حلوى عطرية للمناسبات.

## نصيحة الطاهي

أضف الزعفران دائماً في نهاية الطهي حتى لا تفسد الحرارة العالية رائحته.`,
    },
  },
  "zafaran-va-ziba-i": {
    en: {
      title: "Saffron for Skin and Hair",
      excerpt: "Saffron isn't just a spice — in traditional Persian medicine it's a secret for glowing skin and stronger hair.",
      content: `## Saffron in beauty

For centuries Persian women have used saffron for clear skin and strong hair, and modern science supports these benefits.

## For the skin

- **Natural brightener:** a saffron and milk mask helps brighten the skin.
- **Anti-acne:** saffron's antibacterial properties help reduce acne.
- **Anti-ageing:** saffron's antioxidants fight wrinkles.

## A simple saffron mask

Soak a few threads in a spoonful of milk. After 15 minutes mix with a spoonful of honey, apply to the skin and rinse after 20 minutes.

## For the hair

Massaging saffron oil into the scalp helps strengthen the roots and reduce hair loss.`,
    },
    tr: {
      title: "Cilt ve Saç için Safran",
      excerpt: "Safran yalnızca bir baharat değil; geleneksel İran tıbbında parlak cilt ve güçlü saçın sırrı.",
      content: `## Güzellik dünyasında safran

Yüzyıllardır İranlı kadınlar berrak bir cilt ve güçlü saçlar için safran kullanır; modern bilim de bu faydaları destekliyor.

## Cilt için

- **Doğal aydınlatıcı:** safran ve süt maskesi cildi aydınlatır.
- **Sivilceye karşı:** safranın antibakteriyel özelliği akneyi azaltır.
- **Yaşlanma karşıtı:** safranın antioksidanları kırışıklıklarla savaşır.

## Basit safran maskesi

Birkaç tel safranı bir kaşık sütte bekletin. 15 dakika sonra bir kaşık balla karıştırıp cilde sürün, 20 dakika sonra yıkayın.

## Saç için

Safran yağıyla saç derisine masaj yapmak kökleri güçlendirir ve dökülmeyi azaltır.`,
    },
    ar: {
      title: "فوائد الزعفران للبشرة والشعر",
      excerpt: "الزعفران ليس مجرد تابل؛ إنه سرّ إشراقة البشرة وقوة الشعر في الطب الإيراني التقليدي.",
      content: `## الزعفران في عالم الجمال

منذ قرون تستخدم النساء الإيرانيات الزعفران لنضارة البشرة وتقوية الشعر، والعلم الحديث يؤكد هذه الفوائد.

## فوائد للبشرة

- **مفتّح طبيعي:** قناع الزعفران والحليب يساعد على تفتيح البشرة.
- **مضاد لحب الشباب:** خصائص الزعفران المضادة للبكتيريا تقلل حب الشباب.
- **مضاد للشيخوخة:** مضادات الأكسدة في الزعفران تحارب التجاعيد.

## قناع زعفران بسيط

انقع بضع خيوط زعفران في ملعقة حليب، وبعد 15 دقيقة اخلطها بملعقة عسل وضعها على البشرة ثم اغسلها بعد 20 دقيقة.

## للشعر

تدليك فروة الرأس بزيت الزعفران يقوي جذور الشعر ويقلل تساقطه.`,
    },
  },
};
