package es.codeurjc.betsphere;

import org.springframework.boot.SpringApplication;

public class TestBetsphereApplication {

	public static void main(String[] args) {
		SpringApplication.from(BetsphereApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
