package com.rafael.garage_tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/externa")
@CrossOrigin("*") 
public class FipeController {

    @Autowired
    private RestTemplate restTemplate;

    private static final String BASE_URL = "https://fipe.parallelum.com.br/api/v2/cars/";

    @GetMapping("/fipe/{codigo}")
    public ResponseEntity<Object> consultarPreco(@PathVariable String codigo) {
        // Limpa o código e garante o formato 000000-0 exigido por esta API
        String codigoFipe = codigo.replace("-", "").trim();
        if (codigoFipe.length() == 7) {
            codigoFipe = codigoFipe.substring(0, 6) + "-" + codigoFipe.substring(6);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);

            System.out.println("🔍 Buscando anos para o código: " + codigoFipe);

            // Obter a lista de anos disponíveis para o código FIPE
            ResponseEntity<List<Map<String, String>>> resAnos = restTemplate.exchange(
                BASE_URL + codigoFipe + "/years",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Map<String, String>>>() {}
            );

            List<Map<String, String>> anos = resAnos.getBody();

            if (anos == null || anos.isEmpty()) {
                return ResponseEntity.status(404).body("Nenhum veículo encontrado com este código.");
            }

            // Pegamos o código do ano mais recente (geralmente o primeiro da lista)
            String codigoAnoMaisRecente = anos.get(0).get("code");

            System.out.println("🚗 Buscando detalhes do ano: " + codigoAnoMaisRecente);

            // Obter os detalhes (Preço, Marca, Modelo) desse ano específico
            ResponseEntity<Map<String, Object>> resDetalhes = restTemplate.exchange(
                BASE_URL + codigoFipe + "/years/" + codigoAnoMaisRecente,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> fipeData = resDetalhes.getBody();

            // Mapeamos para os nomes que seu page.tsx já utiliza
            Map<String, String> resultado = new HashMap<>();
            resultado.put("marca", String.valueOf(fipeData.get("brand")));
            resultado.put("modelo", String.valueOf(fipeData.get("model")));
            resultado.put("valor", String.valueOf(fipeData.get("price")));
            resultado.put("ano", String.valueOf(fipeData.get("modelYear")));

            return ResponseEntity.ok(new Object[] { resultado });

        } catch (Exception e) {
            System.err.println("❌ Erro na consulta Parallelum: " + e.getMessage());
            return ResponseEntity.status(503).body("Serviço FIPE indisponível ou código inválido.");
        }
    }
}