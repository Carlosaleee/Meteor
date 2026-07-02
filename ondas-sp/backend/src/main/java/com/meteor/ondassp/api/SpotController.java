package com.meteor.ondassp.api;

import com.meteor.ondassp.api.dto.SpotResponse;
import com.meteor.ondassp.domain.spot.Spot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/spots")
@Tag(name = "Spots", description = "Surf spots for Ilha Comprida/SP and region")
public class SpotController {

    private static final List<Spot> SPOTS = List.of(
            new Spot(
                    "pedrinhas",
                    "Pedrinhas",
                    "Praia de águas claras no bairro Pedrinhas. Acesso pela orla, ideal para dias de swell sul com ondas organizadas.",
                    -24.9093, -47.7954,
                    "Intermediário", "Quebra de praia",
                    "Março–Outubro", "Acesso pela Rua Pedro Taques. Estacione na orla.", "Ilha Comprida"
            ),
            new Spot(
                    "ponta-praia-norte",
                    "Ponta da Praia Norte",
                    "Ponta exposta no extremo sul com ondas fortes vindas do canal. Swells do sul organizados, para surfadores experientes.",
                    -25.0511, -47.8983,
                    "Avançado", "Quebra de ponta",
                    "Abril–Setembro", "Área remota. Leve água e proteção solar.", "Ilha Comprida Sul"
            ),
            new Spot(
                    "boqueirao-norte",
                    "Boqueirão Norte",
                    "Entrada do canal com ondas quebrando nas bordas. Correnteza forte, muita areia. Pico dos locais.",
                    -24.7490, -47.5556,
                    "Avançado", "Quebra de canal",
                    "Maio–Agosto", "Só para experientes. Correnteza de retorno forte.", "Ilha Comprida Norte"
            ),
            new Spot(
                    "juruvauva",
                    "Dunas do Juruvauva",
                    "Praia ampla com dunas e vento constante. Ondas regulares, boa para iniciantes e intermediários.",
                    -24.9282, -47.8525,
                    "Iniciante", "Quebra de praia",
                    "Todo o ano", "Área de dunas. Cuidado com a vegetação protegida.", "Ilha Comprida"
            ),
            new Spot(
                    "pinheiros-araca",
                    "Pinheiros do Araçá",
                    "Balneário tranquilo com ondas progressivas. Boa opção para quem busca paz e mar calmo.",
                    -24.7095, -47.5034,
                    "Iniciante", "Quebra de praia",
                    "Todo o ano", "Praia familiar. Acesso pela rodovia.", "Ilha Comprida Norte"
            ),
            new Spot(
                    "balneario-adriana",
                    "Balneário Adriana",
                    "Praia urbana com comércio próximo. Ondas medianas, boa para praticar.",
                    -24.7285, -47.5395,
                    "Iniciante", "Quebra de praia",
                    "Todo o ano", "Área urbana com restaurantes e pousadas.", "Ilha Comprida"
            ),
            new Spot(
                    "boqueirao-sul",
                    "Boqueirão Sul",
                    "Praia remota com dunas e mangue. Acesso difícil, ondas fortes vindas do canal. Pico dos locais.",
                    -25.0214, -47.9171,
                    "Avançado", "Quebra de canal",
                    "Abril–Setembro", "Leve suprimentos. Sem estrutura na praia.", "Ilha Comprida Sul"
            ),
            new Spot(
                    "balneario-viareggio",
                    "Balneário Viareggio",
                    "Praia com ondas quebrando em bancos de areia. Boa visibilidade e água limpa.",
                    -24.8446, -47.6874,
                    "Intermediário", "Quebra de praia",
                    "Março–Outubro", "Bancos de areia mudam com as marés. Observe antes de entrar.", "Ilha Comprida"
            ),
            new Spot(
                    "balneario-porto-velho",
                    "Balneário Porto Velho",
                    "Praia tranquila com ondas suaves. Ideal para longboard e iniciantes.",
                    -24.7281, -47.5304,
                    "Iniciante", "Quebra de praia",
                    "Todo o ano", "Boa opção para aulas de surf.", "Ilha Comprida"
            ),
            new Spot(
                    "balneario-icarai",
                    "Balneário Icaraí",
                    "Praia com ondas regulares e fundo de areia. Boa para evoluir na prancha.",
                    -24.7363, -47.5466,
                    "Iniciante", "Quebra de praia",
                    "Todo o ano", "Praia familiar com pouca correnteza.", "Ilha Comprida"
            ),
            new Spot(
                    "balneario-atlantico",
                    "Balneário Atlântico",
                    "Praia com ondas medianas e boa infraestrutura. Ponto de encontro de surfistas da região.",
                    -24.7596, -47.5697,
                    "Intermediário", "Quebra de praia",
                    "Março–Outubro", "Bars e restaurantes na orla. Bom para socializar.", "Ilha Comprida"
            ),
            new Spot(
                    "trailer-parada-do-surf",
                    "Trailer Parada do Surf",
                    "Ponto icônico de encontro dos surfistas. Ondas quebram ao longo da praia, boa para todos os níveis.",
                    -24.7906, -47.6205,
                    "Iniciante", "Quebra de praia",
                    "Todo o ano", "Referência dos surfistas locais. Compre seu açaí aqui.", "Ilha Comprida"
            ),
            new Spot(
                    "praia-jureia-barra",
                    "Praia da Jureia — Barra",
                    "Barra do rio Jureia com ondas potentes. Swells do sul trazem ondas grandes e organizadas.",
                    -24.6175, -47.7501,
                    "Avançado", "Quebra de barra",
                    "Maio–Agosto", "Acesso pelo balneário Jureia. Cuidado com a correnteza do rio.", "Jureia"
            ),
            new Spot(
                    "costao-jureia",
                    "Costão da Jureia",
                    "Costão rochoso com ondas quebrando no pedregulho. Experiência única para surfistas avançados.",
                    -24.6489, -47.4686,
                    "Avançado", "Quebra de costão",
                    "Maio–Agosto", "Área de preservação. Precisa de autorização para acessar.", "Jureia"
            )
    );

    @GetMapping
    @Operation(summary = "List all surf spots near Ilha Comprida/SP and region")
    public ResponseEntity<List<SpotResponse>> listSpots() {
        List<SpotResponse> response = SPOTS.stream()
                .map(s -> new SpotResponse(
                        s.id(), s.name(), s.description(),
                        s.latitude(), s.longitude(),
                        s.difficulty(), s.waveType(),
                        s.bestSeason(), s.tip(), s.region()
                ))
                .toList();
        return ResponseEntity.ok(response);
    }
}
