/* REF-Genius · BEYBLADE — Metal Masters
   Campos de cada Blader:
     id           identificador único (o mesmo Blader usa o MESMO id nas 3 sagas; é assim que o modal junta as Beyblades dele)
     blader       nome do Blader
     aka          (opcional) outro nome/alter ego
     team         (opcional) equipe nesta saga
     wiki         título da página do Blader na Beyblade Wiki (Fandom) — usado para buscar a imagem
     bladerImage  URL da imagem do Blader; null = busca automática pela wiki, depois placeholder
     beyblades[]  { name, wiki (título ou lista de títulos), image (URL ou null), confirmed:false (se não confirmado), note }
   Para fixar uma imagem manualmente, preencha bladerImage/image com a URL real (tem prioridade sobre a busca). */
const metalMasters = [
  {"id": "gingka-hagane", "blader": "Gingka Hagane", "wiki": "Gingka_Hagane", "bladerImage": null, "team": "Gan-Gan Galaxy", "beyblades": [{"name": "Galaxy Pegasus W105R2F", "wiki": "Galaxy_Pegasus_W105R2F", "image": null}]},
  {"id": "kenta-yumiya", "blader": "Kenta Yumiya", "wiki": "Kenta_Yumiya", "bladerImage": null, "team": "Gan-Gan Galaxy", "beyblades": [{"name": "Flame Sagittario C145S", "wiki": "Flame_Sagittario_C145S", "image": null, "confirmed": false}]},
  {"id": "masamune-kadoya", "blader": "Masamune Kadoya", "wiki": "Masamune_Kadoya", "bladerImage": null, "team": "Gan-Gan Galaxy", "beyblades": [{"name": "Ray Unicorno D125CS", "wiki": ["Ray_Unicorno_D125CS", "Ray_Striker_D125CS"], "image": null, "note": "Nome japonês: Ray Striker"}]},
  {"id": "tsubasa-otori", "blader": "Tsubasa Otori", "wiki": "Tsubasa_Otori", "bladerImage": null, "team": "Gan-Gan Galaxy", "beyblades": [{"name": "Earth Aquila 145WD", "wiki": ["Earth_Aquila_145WD", "Earth_Eagle_145WD"], "image": null, "note": "Nome japonês: Earth Eagle"}]},
  {"id": "yu-tendo", "blader": "Yu Tendo", "wiki": "Yu_Tendo", "bladerImage": null, "team": "Gan-Gan Galaxy", "beyblades": [{"name": "Flame Libra T125ES", "wiki": "Flame_Libra_T125ES", "image": null}]},
  {"id": "kyoya-tategami", "blader": "Kyoya Tategami", "wiki": "Kyoya_Tategami", "bladerImage": null, "team": "Wild Fang", "beyblades": [{"name": "Rock Leone 145WB", "wiki": "Rock_Leone_145WB", "image": null}]},
  {"id": "benkei-hanawa", "blader": "Benkei Hanawa", "wiki": "Benkei_Hanawa", "bladerImage": null, "team": "Wild Fang", "beyblades": [{"name": "Dark Bull H145SD", "wiki": "Dark_Bull_H145SD", "image": null, "confirmed": false}]},
  {"id": "nile", "blader": "Nile", "wiki": "Nile", "bladerImage": null, "team": "Wild Fang", "beyblades": [{"name": "Vulcan Horuseus 145WD", "wiki": "Vulcan_Horuseus_145WD", "image": null}]},
  {"id": "dashan-wang", "blader": "Dashan Wang", "wiki": "Dashan_Wang", "bladerImage": null, "team": "Wang Hu Zhong", "beyblades": [{"name": "Rock Giraffe R145WB", "wiki": ["Rock_Giraffe_R145WB", "Rock_Zurafa_R145WB"], "image": null, "note": "Nome japonês: Rock Zurafa"}]},
  {"id": "chi-yun-li", "blader": "Chi-Yun Li", "wiki": "Chiyun_Li", "bladerImage": null, "team": "Wang Hu Zhong", "beyblades": [{"name": "Thermal Lacerta", "wiki": "Thermal_Lacerta", "image": null}]},
  {"id": "mei-mei", "blader": "Mei-Mei", "wiki": "Mei-Mei", "bladerImage": null, "team": "Wang Hu Zhong", "beyblades": [{"name": "Aquario 105F", "wiki": "Aquario_105F", "image": null}]},
  {"id": "julian-konzern", "blader": "Julian Konzern", "wiki": "Julian_Konzern", "bladerImage": null, "team": "Excalibur", "beyblades": [{"name": "Gravity Perseus AD145WD", "wiki": ["Gravity_Perseus_AD145WD", "Gravity_Destroyer_AD145WD"], "image": null, "note": "Nome japonês: Gravity Destroyer"}]},
  {"id": "sophie", "blader": "Sophie", "wiki": "Sophie", "bladerImage": null, "team": "Excalibur", "beyblades": [{"name": "Grand Cetus WD145RS", "wiki": "Grand_Cetus_WD145RS", "image": null}]},
  {"id": "argo-garcia", "blader": "Argo Garcia", "wiki": "Argo_Garcia", "bladerImage": null, "team": "Garcia", "beyblades": [{"name": "Ray Gil", "wiki": "Ray_Gil", "image": null, "note": "Dono (Argo/Selen/Ian) deduzido de uma lista, revisar"}]},
  {"id": "selen-garcia", "blader": "Selen Garcia", "wiki": "Selen_Garcia", "bladerImage": null, "team": "Garcia", "beyblades": [{"name": "Ray Gasher", "wiki": "Ray_Gasher", "image": null, "note": "Dono (Argo/Selen/Ian) deduzido de uma lista, revisar"}]},
  {"id": "damian-hart", "blader": "Damian Hart", "wiki": "Damian_Hart", "bladerImage": null, "team": "Star Breaker", "beyblades": [{"name": "Hell Kerbecs BD145DS", "wiki": ["Hell_Kerbecs_BD145DS", "Hades_Kerbecs_BD145DS"], "image": null, "note": "Nome japonês: Hades Kerbecs"}]},
  {"id": "jack", "blader": "Jack", "wiki": "Jack", "bladerImage": null, "team": "Star Breaker", "beyblades": [{"name": "Evil Befall UW145EWD", "wiki": "Evil_Befall_UW145EWD", "image": null}]},
  {"id": "zeo-abyss", "blader": "Zeo Abyss", "wiki": "Zeo_Abyss", "bladerImage": null, "team": "Star Breaker", "beyblades": [{"name": "Flame Byxis", "wiki": "Flame_Byxis", "image": null}]},
  {"id": "toby", "blader": "Toby", "wiki": "Toby", "bladerImage": null, "aka": "Faust", "team": "Star Breaker", "beyblades": [{"name": "Basalt Horogium 145WD", "wiki": ["Basalt_Horogium_145WD", "Twisted_Tempo_145WD"], "image": null, "note": "Outro nome: Twisted Tempo"}]},
  {"id": "ryuga", "blader": "Ryuga", "wiki": "Ryuga", "bladerImage": null, "beyblades": [{"name": "Meteo L-Drago LW105LF", "wiki": "Meteo_L-Drago_LW105LF", "image": null}]},
  {"id": "wales", "blader": "Wales", "wiki": "Wales", "bladerImage": null, "team": "Excalibur", "beyblades": [{"name": "Grand Cetus WD145RS", "wiki": "Grand_Cetus_WD145RS", "image": null, "confirmed": false, "note": "A mesma Beyblade aparece para Wales e Sophie; dono real não confirmado"}]},
  {"id": "ian-garcia", "blader": "Ian Garcia", "wiki": "Ian_Garcia", "bladerImage": null, "team": "Garcia", "beyblades": [{"name": "Cyclone Herculeo 105F", "wiki": "Cyclone_Herculeo_105F", "image": null, "confirmed": false}]},
  {"id": "klaus", "blader": "Klaus", "wiki": "Klaus", "bladerImage": null, "team": "Excalibur", "beyblades": [{"name": "Grand Capricorn", "wiki": "Grand_Capricorn", "image": null, "confirmed": false, "note": "Associação inferida"}]},
  {"id": "chao-xin", "blader": "Chao Xin", "wiki": "Chao_Xin", "bladerImage": null, "team": "Wang Hu Zhong", "beyblades": [{"name": "Poison Virgo", "wiki": ["Poison_Virgo", "Virgo"], "image": null, "confirmed": false, "note": "Nome em inglês e código não confirmados"}]},
  {"id": "hikaru-hasama", "blader": "Hikaru Hasama", "wiki": "Hikaru_Hasama", "bladerImage": null, "beyblades": [{"name": "Aquario", "wiki": "Aquario", "image": null, "confirmed": false, "note": "Código e variante (Storm Aquario?) não confirmados"}]},
  {"id": "dr-ziggurat", "blader": "Dr. Ziggurat", "wiki": "Dr._Ziggurat", "bladerImage": null, "team": "Hades Inc.", "beyblades": [{"name": "Spiral Capricorn", "wiki": "Spiral_Capricorn", "image": null, "confirmed": false, "note": "Associação inferida"}]},
  {"id": "nowaguma", "blader": "Nowaguma", "wiki": "Nowaguma", "bladerImage": null, "beyblades": [{"name": "Rock Orso", "wiki": "Rock_Orso", "image": null, "confirmed": false, "note": "Associação inferida"}]}
];
