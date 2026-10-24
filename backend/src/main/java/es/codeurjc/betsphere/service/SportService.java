package es.codeurjc.betsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.repository.SportRepository;

@Service 
public class SportService {
    private final SportRepository sportRepository;

    public SportService(SportRepository sportRepository) {
        this.sportRepository = sportRepository;
    }

    public List<Sport> findAll() {
        return sportRepository.findAll();
    }

    public Sport findById(Long id) {
        return sportRepository.findById(id).orElseThrow();
    }

    public Sport save(Sport sport) {
        if (sport.getName() == null || sport.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Sport name cannot be empty.");
        }
        if (sportRepository.findByName(sport.getName()).isPresent()) {
            throw new IllegalArgumentException("A sport with this name already exists.");
        }
        return sportRepository.save(sport);
    }

    public Sport update(Long id, Sport updatedSport) {
        if (updatedSport.getName() == null || updatedSport.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Sport name cannot be empty.");
        }
        
        Sport existingSport = findById(id);
        
        sportRepository.findByName(updatedSport.getName())
            .ifPresent(sport -> {
                if (!sport.getId().equals(id)) {
                    throw new IllegalArgumentException("A sport with this name already exists.");
                }
            });

        existingSport.setName(updatedSport.getName());
        existingSport.setIconUrl(updatedSport.getIconUrl());
        return sportRepository.save(existingSport);
    }

    @Transactional
    public void delete(Long id) {
        Sport sport = findById(id);
        if (!sport.getCompetitions().isEmpty()) {
            throw new IllegalStateException("Cannot delete a sport that has competitions. Remove or reassign its competitions first.");
        }
        sportRepository.delete(sport);
    }
}
