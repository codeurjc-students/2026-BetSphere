package es.codeurjc.betsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;

@Service
public class MatchService {
    
    private final MatchRepository matchRepo;

    public MatchService(MatchRepository matchRepo){
        this.matchRepo = matchRepo;
    }

    public List<Match> getAllMatches(){
        return matchRepo.findAll();
    }

}
