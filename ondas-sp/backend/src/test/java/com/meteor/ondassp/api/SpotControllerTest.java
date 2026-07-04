package com.meteor.ondassp.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SpotController.class)
@ActiveProfiles("test")
class SpotControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnListOfSpots() throws Exception {
        mockMvc.perform(get("/api/spots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(14))
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].name").isNotEmpty())
                .andExpect(jsonPath("$[0].latitude").isNumber())
                .andExpect(jsonPath("$[0].longitude").isNumber())
                .andExpect(jsonPath("$[0].difficulty").isNotEmpty())
                .andExpect(jsonPath("$[0].waveType").isNotEmpty());
    }

    @Test
    void shouldContainIlhaCompridaSpots() throws Exception {
        mockMvc.perform(get("/api/spots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == 'pedrinhas')]").isArray())
                .andExpect(jsonPath("$[?(@.id == 'juruvauva')]").isArray())
                .andExpect(jsonPath("$[?(@.id == 'trailer-parada-do-surf')]").isArray());
    }
}
