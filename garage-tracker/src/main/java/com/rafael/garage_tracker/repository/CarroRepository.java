package com.rafael.garage_tracker.repository;

import com.rafael.garage_tracker.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarroRepository extends JpaRepository<Carro, Long> {
    // Aqui o Spring já cria automaticamente métodos como:
    // save(), findAll(), findById(), deleteById()
}
