
export class BluetoothService {
  private device: any = null;
  private server: any = null;
  private characteristic: any = null;

  async requestWatchConnection(onHeartRateUpdate: (hr: number) => void): Promise<string> {
    try {
      const heartRateServiceUuid = 'heart_rate';
      const heartRateCharacteristicUuid = 'heart_rate_measurement';

      this.device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: [heartRateServiceUuid] }],
        optionalServices: ['battery_service']
      });

      this.server = await this.device.gatt?.connect() || null;
      if (!this.server) throw new Error("GATT Server connection failed");

      const service = await this.server.getPrimaryService(heartRateServiceUuid);
      this.characteristic = await service.getCharacteristic(heartRateCharacteristicUuid);

      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const heartRate = value.getUint8(1);
        onHeartRateUpdate(heartRate);
      });

      return this.device.name || "Iron Watch";
    } catch (error) {
      console.error("Bluetooth Connection Error:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.server = null;
    this.characteristic = null;
  }
}

export const bluetoothManager = new BluetoothService();
