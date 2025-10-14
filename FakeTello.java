import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class FakeTello {
    public static final int CMD_PORT = 8889;
    public static final int STATUS_PORT = 8890;
    public static final int STATUS_INTERVAL_MS = 1000;

    private DatagramSocket cmdSocket;
    private volatile InetAddress lastClientAddr = null;
    private volatile int lastClientCmdPort = -1;
    private AtomicInteger battery = new AtomicInteger(100);
    private AtomicInteger height = new AtomicInteger(0);
    private AtomicBoolean airborne = new AtomicBoolean(false);
    private AtomicBoolean running = new AtomicBoolean(true);

    public FakeTello() throws Exception {
        cmdSocket = new DatagramSocket(CMD_PORT);
        System.out.println("[FakeTello] Listening for commands on UDP " + CMD_PORT);
    }

    public void start() {
        Thread recvThread = new Thread(this::recvLoop, "tello-recv");
        Thread statusThread = new Thread(this::statusLoop, "tello-status");
        recvThread.setDaemon(true);
        statusThread.setDaemon(true);
        recvThread.start();
        statusThread.start();
    }

    private void recvLoop() {
        byte[] buf = new byte[2048];
        while (running.get()) {
            try {
                DatagramPacket packet = new DatagramPacket(buf, buf.length);
                cmdSocket.receive(packet);
                String cmd = new String(packet.getData(), 0, packet.getLength(), StandardCharsets.UTF_8).trim();
                InetAddress addr = packet.getAddress();
                int port = packet.getPort();
                System.out.println("[CMD recv from " + addr.getHostAddress() + ":" + port + "] " + cmd);

                // remember client ip (status goes to client ip:8890)
                lastClientAddr = addr;
                lastClientCmdPort = port;

                String resp = handleCommand(cmd);
                byte[] respB = resp.getBytes(StandardCharsets.UTF_8);
                DatagramPacket respPacket = new DatagramPacket(respB, respB.length, addr, port);
                cmdSocket.send(respPacket);
                System.out.println("[CMD resp to " + addr.getHostAddress() + ":" + port + "] " + resp);
            } catch (Exception e) {
                System.err.println("[ERROR recvLoop] " + e.getMessage());
            }
        }
        cmdSocket.close();
    }

    private String handleCommand(String cmd) {
        String c = cmd.toLowerCase();
        if (c.equals("command")) return "ok";
        if (c.equals("takeoff")) {
            if (airborne.compareAndSet(false, true)) {
                height.set(50);
                return "ok";
            } else return "error";
        }
        if (c.equals("land")) {
            if (airborne.compareAndSet(true, false)) {
                height.set(0);
                return "ok";
            } else return "error";
        }
        if (c.equals("battery?")) {
            return Integer.toString(battery.get());
        }
        if (c.startsWith("forward") || c.startsWith("back") || c.startsWith("left")
            || c.startsWith("right") || c.startsWith("up") || c.startsWith("down")
            || c.startsWith("cw") || c.startsWith("ccw")) {
            return "ok";
        }
        if (c.equals("streamon") || c.equals("streamoff")) {
            return "ok";
        }
        return "error";
    }

    private void statusLoop() {
        try (DatagramSocket statusSocket = new DatagramSocket()) {
            while (running.get()) {
                if (lastClientAddr != null) {
                    String status = String.format(
                        "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:60;temph:70;tof:10;h:%d;bat:%d;baro:0;time:100;agx:0;agy:0;agz:0;",
                        height.get(), battery.get());
                    byte[] data = status.getBytes(StandardCharsets.UTF_8);
                    DatagramPacket p = new DatagramPacket(data, data.length, lastClientAddr, STATUS_PORT);
                    statusSocket.send(p);
                    System.out.println("[STATUS -> " + lastClientAddr.getHostAddress() + ":" + STATUS_PORT + "] " + status);
                }
                if (airborne.get()) {
                    // drain battery slowly
                    battery.getAndUpdate(v -> Math.max(0, v - 1));
                }
                Thread.sleep(STATUS_INTERVAL_MS);
            }
        } catch (Exception e) {
            System.err.println("[ERROR statusLoop] " + e.getMessage());
        }
    }

    public void stop() {
        running.set(false);
        cmdSocket.close();
    }

    public static void main(String[] args) throws Exception {
        FakeTello ft = new FakeTello();
        ft.start();
        System.out.println("[FakeTello] Running. Ctrl+C to stop.");
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("[FakeTello] Shutting down...");
            ft.stop();
        }));
        // keep main alive
        while (true) Thread.sleep(1000);
    }
}