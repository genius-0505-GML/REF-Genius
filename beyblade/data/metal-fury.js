/* REF-Genius · BEYBLADE — Metal Fury
   Campos de cada Blader:
     id           identificador único (o mesmo Blader usa o MESMO id nas 3 sagas; é assim que o modal junta as Beyblades dele)
     blader       nome do Blader
     aka          (opcional) outro nome/alter ego
     team         (opcional) equipe nesta saga
     wiki         título da página do Blader na Beyblade Wiki (Fandom) — usado para buscar a imagem
     bladerImage  URL da imagem do Blader; null = busca automática pela wiki, depois placeholder
     beyblades[]  { name, wiki (título ou lista de títulos), image (URL ou null), confirmed:false (se não confirmado), note }
   Para fixar uma imagem manualmente, preencha bladerImage/image com a URL real (tem prioridade sobre a busca). */
const metalFury = [
  {"id": "gingka-hagane", "blader": "Gingka Hagane", "wiki": "Gingka_Hagane", "bladerImage": null, "beyblades": [{"name": "Cosmic Pegasus F:D", "wiki": ["Cosmic_Pegasus_F:D", "Big_Bang_Pegasus_F:D"], "image": null, "note": "Nome japonês: Big Bang Pegasus F:D"}]},
  {"id": "kyoya-tategami", "blader": "Kyoya Tategami", "wiki": "Kyoya_Tategami", "bladerImage": null, "beyblades": [{"name": "Fang Leone 130W2D", "wiki": "Fang_Leone_130W2D", "image": null}]},
  {"id": "ryuga", "blader": "Ryuga", "wiki": "Ryuga", "bladerImage": null, "beyblades": [{"name": "L-Drago Destructor F:S", "wiki": "L-Drago_Destructor_F:S", "image": null}]},
  {"id": "yu-tendo", "blader": "Yu Tendo", "wiki": "Yu_Tendo", "bladerImage": null, "beyblades": [{"name": "Flame Libra T125ES", "wiki": "Flame_Libra_T125ES", "image": null}]},
  {"id": "tsubasa-otori", "blader": "Tsubasa Otori", "wiki": "Tsubasa_Otori", "bladerImage": null, "beyblades": [{"name": "Earth Aquila 145WD", "wiki": ["Earth_Aquila_145WD", "Earth_Eagle_145WD"], "image": null, "note": "Nome japonês: Earth Eagle"}]},
  {"id": "kenta-yumiya", "blader": "Kenta Yumiya", "wiki": "Kenta_Yumiya", "bladerImage": null, "beyblades": [{"name": "Flame Sagittario C145S", "wiki": "Flame_Sagittario_C145S", "image": null}, {"name": "Flash Sagittario 230WD", "wiki": "Flash_Sagittario_230WD", "image": null}]},
  {"id": "benkei-hanawa", "blader": "Benkei Hanawa", "wiki": "Benkei_Hanawa", "bladerImage": null, "beyblades": [{"name": "Dark Bull H145SD", "wiki": "Dark_Bull_H145SD", "image": null, "confirmed": false}]},
  {"id": "hyoma", "blader": "Hyoma", "wiki": "Hyoma", "bladerImage": null, "beyblades": [{"name": "Samurai Ifrit W145CF", "wiki": "Samurai_Ifrit_W145CF", "image": null}]},
  {"id": "zeo-abyss", "blader": "Zeo Abyss", "wiki": "Zeo_Abyss", "bladerImage": null, "beyblades": [{"name": "Screw Fox", "wiki": "Screw_Fox", "image": null}]},
  {"id": "julian-konzern", "blader": "Julian Konzern", "wiki": "Julian_Konzern", "bladerImage": null, "beyblades": [{"name": "Gravity Perseus AD145WD", "wiki": ["Gravity_Perseus_AD145WD", "Gravity_Destroyer_AD145WD"], "image": null, "note": "Nome japonês: Gravity Destroyer"}]},
  {"id": "nile", "blader": "Nile", "wiki": "Nile", "bladerImage": null, "beyblades": [{"name": "Vulcan Horuseus 145WD", "wiki": "Vulcan_Horuseus_145WD", "image": null}]},
  {"id": "dashan-wang", "blader": "Dashan Wang", "wiki": "Dashan_Wang", "bladerImage": null, "beyblades": [{"name": "Rock Giraffe R145WB", "wiki": ["Rock_Giraffe_R145WB", "Rock_Zurafa_R145WB"], "image": null, "note": "Nome japonês: Rock Zurafa"}]},
  {"id": "toby", "blader": "Toby", "wiki": "Toby", "bladerImage": null, "aka": "Faust", "beyblades": [{"name": "Basalt Horogium 145WD", "wiki": ["Basalt_Horogium_145WD", "Twisted_Tempo_145WD"], "image": null, "note": "Outro nome: Twisted Tempo"}]},
  {"id": "damian-hart", "blader": "Damian Hart", "wiki": "Damian_Hart", "bladerImage": null, "beyblades": [{"name": "Hell Kerbecs BD145DS", "wiki": ["Hell_Kerbecs_BD145DS", "Hades_Kerbecs_BD145DS"], "image": null, "note": "Nome japonês: Hades Kerbecs"}]},
  {"id": "yuki-mizusawa", "blader": "Yuki Mizusawa", "wiki": "Yuki_Mizusawa", "bladerImage": null, "aka": "Mercury", "beyblades": [{"name": "Mercury Anubis 85XF", "wiki": "Mercury_Anubis_85XF", "image": null}]},
  {"id": "king", "blader": "King", "wiki": "King", "bladerImage": null, "aka": "Mars", "beyblades": [{"name": "Variares D:D", "wiki": "Variares_D:D", "image": null}]},
  {"id": "aguma", "blader": "Aguma", "wiki": "Aguma", "bladerImage": null, "beyblades": [{"name": "Scythe Kronos T125EDS", "wiki": "Scythe_Kronos_T125EDS", "image": null}]},
  {"id": "dynamis", "blader": "Dynamis", "wiki": "Dynamis", "bladerImage": null, "beyblades": [{"name": "Jade Jupiter S130RB", "wiki": "Jade_Jupiter_S130RB", "image": null}]},
  {"id": "chris", "blader": "Chris", "wiki": "Chris", "bladerImage": null, "beyblades": [{"name": "Phantom Orion B:D", "wiki": "Phantom_Orion_B:D", "image": null}]},
  {"id": "pluto", "blader": "Pluto", "wiki": "Pluto", "bladerImage": null, "beyblades": [{"name": "Fusion Hades", "wiki": "Fusion_Hades", "image": null}]},
  {"id": "rago", "blader": "Rago", "wiki": "Rago", "bladerImage": null, "beyblades": [{"name": "Diablo Nemesis X:D", "wiki": "Diablo_Nemesis_X:D", "image": null}]},
  {"id": "masamune-kadoya", "blader": "Masamune Kadoya", "wiki": "Masamune_Kadoya", "bladerImage": null, "beyblades": [{"name": "Blitz Unicorno 100RSF", "wiki": ["Blitz_Unicorno_100RSF", "Blitz_Striker_100RSF"], "image": null, "confirmed": false, "note": "Evolução em Metal Fury; nome/código não confirmados por fonte"}]},
  {"id": "bao", "blader": "Bao", "wiki": "Bao", "bladerImage": null, "beyblades": [{"name": "Hell Crown", "wiki": "Hell_Crown", "image": null, "confirmed": false, "note": "Código desconhecido"}]},
  {"id": "hikaru-hasama", "blader": "Hikaru Hasama", "wiki": "Hikaru_Hasama", "bladerImage": null, "beyblades": [{"name": "Aquario", "wiki": "Aquario", "image": null, "confirmed": false, "note": "Código não confirmado"}]},
  {"id": "ryo-hagane", "blader": "Ryo Hagane", "wiki": "Ryo_Hagane", "bladerImage": null, "beyblades": [{"name": "Burn Fireblaze 135MS", "wiki": "Burn_Fireblaze_135MS", "image": null, "confirmed": false, "note": "Não confirmado nesta temporada"}]}
];
