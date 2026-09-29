package es.codeurjc.betsphere.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.codeurjc.betsphere.dto.MatchDTO;
import es.codeurjc.betsphere.dto.MatchMapper;
import es.codeurjc.betsphere.service.MatchService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/v1/matches")

public class MatchRESTController {
    
    private final MatchService matchService;
    private final MatchMapper mapper;

    public MatchRESTController(MatchService matchService, MatchMapper mapper){
        this.matchService = matchService;
        this.mapper = mapper;
    }

    @GetMapping("/")
    public List<MatchDTO> getMatches() {
        return mapper.toDTOs(matchService.getAllMatches());
    }
    
}
