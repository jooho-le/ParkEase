import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ParkingLot } from '../lib/types';

export default function ReservationDialog({
  lot,
  open,
  onOpenChange,
  onConfirm,
}: {
  lot: ParkingLot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  if (!lot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예약 홀드</DialogTitle>
          <DialogDescription>
            <strong>{lot.name}</strong>에 15분 홀드가 생성됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          여석: <span className="font-semibold text-slate-900">{lot.availableSlots}</span>
          <br />
          구역: {lot.zones.map((zone) => zone.name).join(', ')}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={onConfirm}>홀드 생성</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
