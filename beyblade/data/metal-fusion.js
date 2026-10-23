/* REF-Genius · BEYBLADE — Metal Fusion
   Campos de cada Blader:
     id           identificador único (o mesmo Blader usa o MESMO id nas 3 sagas; é assim que o modal junta as Beyblades dele)
     blader       nome do Blader
     aka          (opcional) outro nome/alter ego
     team         (opcional) equipe nesta saga
     wiki         título da página do Blader na Beyblade Wiki (Fandom) — usado para buscar a imagem
     bladerImage  URL da imagem do Blader; null = busca automática pela wiki, depois placeholder
     beyblades[]  { name, wiki (título ou lista de títulos), image (URL ou null), confirmed:false (se não confirmado), note }
   Para fixar uma imagem manualmente, preencha bladerImage/image com a URL real (tem prioridade sobre a busca). */
const metalFusion = [
  {"id": "gingka-hagane", "blader": "Gingka Hagane", "wiki": "Gingka_Hagane", "bladerImage": null, "beyblades": [{"name": "Storm Pegasus 105RF", "wiki": "Storm_Pegasus_105RF", "image": null}]},
  {"id": "kenta-yumiya", "blader": "Kenta Yumiya", "wiki": "Kenta_Yumiya", "bladerImage": null, "beyblades": [{"name": "Flame Sagittario C145S", "wiki": "Flame_Sagittario_C145S", "image": null}]},
  {"id": "kyoya-tategami", "blader": "Kyoya Tategami", "wiki": "Kyoya_Tategami", "bladerImage": null, "team": "Face Hunters", "beyblades": [{"name": "Rock Leone 145WB", "wiki": "Rock_Leone_145WB", "image": null}]},
  {"id": "benkei-hanawa", "blader": "Benkei Hanawa", "wiki": "Benkei_Hanawa", "bladerImage": null, "team": "Face Hunters", "beyblades": [{"name": "Dark Bull H145SD", "wiki": "Dark_Bull_H145SD", "image": null}]},
  {"id": "doji", "blader": "Doji", "wiki": "Doji", "bladerImage": null, "team": "Dark Nebula", "beyblades": [{"name": "Dark Wolf DF145FS", "wiki": "Dark_Wolf_DF145FS", "image": null, "note": "Nome conferido apenas por memória do agente de pesquisa; revisar"}]},
  {"id": "ryuga", "blader": "Ryuga", "wiki": "Ryuga", "bladerImage": null, "team": "Dark Nebula", "beyblades": [{"name": "Lightning L-Drago 100HF", "wiki": "Lightning_L-Drago_100HF", "image": null}]},
  {"id": "reiji-mizuchi", "blader": "Reiji Mizuchi", "wiki": "Reiji", "bladerImage": null, "team": "Dark Nebula", "beyblades": [{"name": "Poison Serpent SW145SD", "wiki": "Poison_Serpent_SW145SD", "image": null}]},
  {"id": "yu-tendo", "blader": "Yu Tendo", "wiki": "Yu_Tendo", "bladerImage": null, "beyblades": [{"name": "Flame Libra T125ES", "wiki": "Flame_Libra_T125ES", "image": null}]},
  {"id": "tsubasa-otori", "blader": "Tsubasa Otori", "wiki": "Tsubasa_Otori", "bladerImage": null, "beyblades": [{"name": "Earth Aquila 145WD", "wiki": ["Earth_Aquila_145WD", "Earth_Eagle_145WD"], "image": null, "note": "Nome japonês: Earth Eagle"}]},
  {"id": "hyoma", "blader": "Hyoma", "wiki": "Hyoma", "bladerImage": null, "beyblades": [{"name": "Rock Aries ED145B", "wiki": "Rock_Aries_ED145B", "image": null}]},
  {"id": "tetsuya-watarigani", "blader": "Tetsuya Watarigani", "wiki": "Tetsuya_Watarigani", "bladerImage": null, "beyblades": [{"name": "Dark Cancer CH120SF", "wiki": "Dark_Cancer_CH120SF", "image": null}]},
  {"id": "sora", "blader": "Sora", "wiki": "Sora", "bladerImage": null, "beyblades": [{"name": "Cyber Pegasus 100HF", "wiki": "Cyber_Pegasus_100HF", "image": null}]},
  {"id": "ryutaro-fukami", "blader": "Ryutaro Fukami", "wiki": "Ryutaro_Fukami", "bladerImage": null, "beyblades": [{"name": "Thermal Pisces", "wiki": "Thermal_Pisces", "image": null}]},
  {"id": "tobio", "blader": "Tobio", "wiki": "Tobio", "bladerImage": null, "aka": "Captain Capri", "beyblades": [{"name": "Storm Capricorne", "wiki": "Storm_Capricorne", "image": null}]},
  {"id": "ryo-hagane", "blader": "Ryo Hagane", "wiki": "Ryo_Hagane", "bladerImage": null, "beyblades": [{"name": "Phoenix", "wiki": "Phoenix", "image": null, "confirmed": false, "note": "Bey do Blader mascarado 'Phoenix'; nome completo não confirmado"}]},
  {"id": "teru", "blader": "Teru", "wiki": "Teru", "bladerImage": null, "beyblades": [{"name": "Virgo", "wiki": "Virgo", "image": null, "confirmed": false}]},
  {"id": "busujima", "blader": "Busujima", "wiki": "Busujima", "bladerImage": null, "beyblades": [{"name": "Rock Escolpio", "wiki": "Rock_Escolpio", "image": null, "confirmed": false}]},
  {"id": "dan", "blader": "Dan", "wiki": "Dan", "bladerImage": null, "beyblades": [{"name": "Killer Gemios", "wiki": "Killer_Gemios", "image": null, "confirmed": false, "note": "Gêmeos Dan e Reiki: não está claro se cada um tem a sua"}]},
  {"id": "reiki", "blader": "Reiki", "wiki": "Reiki", "bladerImage": null, "beyblades": [{"name": "Killer Gemios", "wiki": "Killer_Gemios", "image": null, "confirmed": false, "note": "Gêmeos Dan e Reiki: não está claro se cada um tem a sua"}]}
];
