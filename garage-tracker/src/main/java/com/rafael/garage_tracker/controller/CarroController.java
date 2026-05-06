
package com.rafael.garage_tracker.controller;

import com.rafael.garage_tracker.model.Carro;
import com.rafael.garage_tracker.repository.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/carros")
@CrossOrigin(origins = "http://localhost:3000")
public class CarroController {

    @Autowired
    private CarroRepository repository;

    // Rota para LISTAR todos os carros salvos
    @GetMapping
    public List<Carro> listar() {
        return repository.findAll();
    }

    // Rota para SALVAR um novo carro
    @PostMapping
    public Carro salvar(@RequestBody Carro carro) {
        return repository.save(carro);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
    repository.deleteById(id);
}
    @PutMapping("/{id}")
    public Carro atualizar(@PathVariable Long id, @RequestBody Carro carroAtualizado) {
        return repository.findById(id)
            .map(carro -> {
                carro.setMarca(carroAtualizado.getMarca());
                carro.setModelo(carroAtualizado.getModelo());
                carro.setAno(carroAtualizado.getAno());
                carro.setPreco(carroAtualizado.getPreco());
                return repository.save(carro);
            })
            .orElseGet(() -> {
                carroAtualizado.setId(id);
                return repository.save(carroAtualizado);
            });
}


}