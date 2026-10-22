package es.codeurjc.betsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.repository.CompetitionRepository;

@Service 
public class CompetitionService {
    private final CompetitionRepository competitionRepository;
    private final SportService sportService; 

    public CompetitionService(CompetitionRepository competitionRepository, SportService sportService) {
        this.competitionRepository = competitionRepository;
        this.sportService = sportService;
    }

    public List<Competition> findAll() {
        return competitionRepository.findAll();
    }

    public Competition findById(Long id) {
        return competitionRepository.findById(id).orElseThrow();
    }

    public Competition save(Competition competition, Long sportId) {
        validateName(competition.getName());
        
        Sport sport = sportService.findById(sportId);
        competition.setSport(sport);
        
        return competitionRepository.save(competition);
    }

    public Competition update(Long id, Competition updatedData, Long sportId) {
        validateName(updatedData.getName());
        
        Competition existing = findById(id);
        
        existing.setName(updatedData.getName());
        existing.setCountry(updatedData.getCountry());

        if (!existing.getSport().getId().equals(sportId)) {
            Sport newSport = sportService.findById(sportId);
            existing.setSport(newSport);
        }
        
        return competitionRepository.save(existing);
    }

    public void delete(Long id) {
        Competition competition = findById(id);
        competitionRepository.delete(competition);
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Competition name cannot be empty.");
        }
        //TODO: more validations
    }
}
