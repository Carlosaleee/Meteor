package com.meteor.ondassp.api;

import com.meteor.ondassp.application.MarineService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WaveController.class)
@ActiveProfiles("test")
class WaveControllerEdgeCaseTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MarineService marineService;

    @Test
    void shouldReturn400WhenDateParamIsMissing() throws Exception {
        mockMvc.perform(get("/api/waves/hourly"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenDateParamIsInvalid() throws Exception {
        mockMvc.perform(get("/api/waves/hourly").param("date", "invalid-date"))
                .andExpect(status().isBadRequest());
    }
}
