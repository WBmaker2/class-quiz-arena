import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';

interface ClassroomRow { id: string; name: string; inviteCode: string }
interface Props {
  classroomCode: string;
  classroomName?: string;
  onRenameClassroom?: (name: string) => Promise<string | null>;
  onRenameClassroomById?: (id: string, name: string) => Promise<string | null>;
  onDeleteClassroom?: (id: string) => Promise<string | null>;
  onSelectClassroom?: (id: string) => void;
  classrooms?: ClassroomRow[];
  currentClassroomId?: string | null;
  onNewClassroom?: () => void;
}

export default function TeacherClassroom({ classroomCode, classroomName, onRenameClassroom, onRenameClassroomById, onDeleteClassroom, onSelectClassroom, classrooms, currentClassroomId, onNewClassroom }: Props) {
  const [className, setClassName] = useState(classroomName ?? '');
  const [classError, setClassError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const [listError, setListError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => setClassName(classroomName ?? ''), [classroomName]);

  return (
        <>
          <Card>
            <p className="font-bold mb-3 text-lg">학급 관리</p>
            <div className="flex flex-col gap-2 mb-3">
              <label htmlFor="classroom-name">학급 이름</label>
              <input
                id="classroom-name"
                value={className}
                maxLength={30}
                onChange={(e) => setClassName(e.target.value)}
              />
              {classError && <p>{classError}</p>}
              <div className="flex flex-wrap gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    void (async () => {
                      const msg = await onRenameClassroom?.(className);
                      setClassError(msg ?? null);
                    })();
                  }}
                >
                  이름 저장
                </button>
                <button type="button" onClick={() => onNewClassroom?.()}>
                  새 학급 만들기
                </button>
              </div>
            </div>
            <p className="text-sm mt-2">초대 코드: {classroomCode}</p>
          </Card>
          <Card>
            <p className="font-bold mb-2 text-lg">내 학급 목록</p>
            {(classrooms ?? []).length === 0 ? (
              <p>개설한 학급이 없어요</p>
            ) : (
              (classrooms ?? []).map((c) => (
                <div key={c.id} className="mb-2">
                  {renamingId === c.id ? (
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`rename-${c.id}`}>학급 새 이름</label>
                      <input
                        id={`rename-${c.id}`}
                        value={renameText}
                        maxLength={30}
                        onChange={(e) => setRenameText(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            void (async () => {
                              const msg = await onRenameClassroomById?.(c.id, renameText);
                              if (msg) {
                                setListError(msg);
                              } else {
                                setListError(null);
                                setRenamingId(null);
                              }
                            })();
                          }}
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRenamingId(null);
                            setListError(null);
                          }}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>
                        {c.name}
                        {c.id === (currentClassroomId ?? classroomCode) && <span> (지금 학급)</span>}
                      </p>
                      <p className="text-sm">초대 코드: {c.inviteCode}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {c.id !== (currentClassroomId ?? classroomCode) && (
                          <button type="button" onClick={() => onSelectClassroom?.(c.id)}>
                            입장하기
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setRenamingId(c.id);
                            setRenameText(c.name);
                            setListError(null);
                          }}
                        >
                          이름 바꾸기
                        </button>
                        <button type="button" onClick={() => setDeletingId(c.id)}>
                          학급 삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
            {listError && <p>{listError}</p>}
          </Card>
          {deletingId && (
            <Modal title="학급 삭제 확인" onClose={() => setDeletingId(null)}>
              <p className="font-bold mb-3">
                ‘{(classrooms ?? []).find((c) => c.id === deletingId)?.name ?? ''}’ 학급을 정말 삭제할까요?
                아레나와 대결 기록이 함께 지워져요.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-primary flex-1"
                  onClick={() => {
                    const id = deletingId;
                    setDeletingId(null);
                    void (async () => {
                      const msg = await onDeleteClassroom?.(id);
                      setListError(msg ?? null);
                    })();
                  }}
                >
                  확인
                </button>
                <button type="button" className="flex-1" onClick={() => setDeletingId(null)}>
                  취소
                </button>
              </div>
            </Modal>
          )}
        </>
  );
}
