interface StoredDonation {
  id: string;
  clothesType: string;
  gender: string;
  season: string;
  quantity: number;
  condition: string;
  pickupOrDrop: string;
  location: string;
  images: string[];
  notes: string;
  status: string;
  createdAt: string;
  matchedCenter?: any;
}

class DonationStorage {
  private storageKey = 'clothshare_donations';

  saveDonations(donations: any[]): void {
    const storedDonations: StoredDonation[] = donations.map(item => ({
      id: item.id,
      clothesType: item.clothesType,
      gender: item.gender,
      season: item.season,
      quantity: item.quantity,
      condition: item.condition,
      pickupOrDrop: item.pickupOrDrop,
      location: item.location,
      images: item.images,
      notes: item.notes,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    }));

    const existing = this.getDonations();
    const updated = [...existing, ...storedDonations];
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  getDonations(): StoredDonation[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  updateDonationStatus(id: string, status: string): void {
    const donations = this.getDonations();
    const updated = donations.map(d => 
      d.id === id ? { ...d, status } : d
    );
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  matchDonationToCenter(donationId: string, center: any): void {
    const donations = this.getDonations();
    const updated = donations.map(d => 
      d.id === donationId ? { ...d, status: 'matched', matchedCenter: center } : d
    );
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }
}

export const donationStorage = new DonationStorage();