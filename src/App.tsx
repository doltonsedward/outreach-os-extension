'use client';

import { useState } from 'react';
import { Input, Button, TextArea, Card, Label, Spinner } from '@heroui/react';

const API_URL = 'http://localhost:3001/api/leads'; // ganti kalau deploy

export default function App() {
  const [form, setForm] = useState({
    full_name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      outreach_count: 0,
      outreach_status: 'Not Contacted',
      lead_temperature: 'cold',
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Lead berhasil ditambahkan!' });
        setForm({
          full_name: '',
          company: '',
          email: '',
          phone: '',
          notes: '',
          tags: '',
        });
      } else {
        throw new Error('Gagal simpan');
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Error: Pastikan backend jalan di port 3001',
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <main className="w-96 p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-1">Outreach OS</h1>
        <p className="text-sm text-center mb-6">Tambah lead cepat dari browser</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="input-fullname">Nama Lengkap</Label>
            <Input
              id="input-fullname"
              placeholder="dr. Cynthia Wijaya"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="input-company">Perusahaan</Label>
            <Input
              id="input-company"
              placeholder="Klinik Lumina"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="input-email">Email</Label>
            <Input
              id="input-email"
              type="email"
              placeholder="cynthia@lumina.id"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="input-phone">Phone / WhatsApp</Label>
            <Input
              id="input-phone"
              placeholder="+62815..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="input-notes">Notes / Icebreaker</Label>
            <TextArea
              id="input-notes"
              placeholder="Lihat postingan IG soal HydraFacial..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="input-tags">Tags (pisah koma)</Label>
            <Input
              id="input-tags"
              placeholder="klinik-kecantikan, premium, surabaya"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full my-2"
            variant="primary"
            isPending={loading}
            isDisabled={!form.company && !form.email && !form.phone}>
            {({ isPending }) => <>{isPending ? <Spinner color="current" size="sm" /> : 'Simpan Lead'}</>}
          </Button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {message.text}
          </div>
        )}
      </Card>

      <p className="text-xs text-gray-500 text-center mt-4">Powered by Outreach OS • 2025</p>
    </main>
  );
}
