package moae.dev.Requests;

public class ResetRequest {
    private Boolean hard;

    public ResetRequest() {
        this.hard = false;
    }

    public ResetRequest(Boolean hard) {
        this.hard = hard != null ? hard : false;
    }

    public boolean isHard() {
        return hard != null ? hard : false;
    }

    public void setHard(Boolean hard) {
        this.hard = hard;
    }
}