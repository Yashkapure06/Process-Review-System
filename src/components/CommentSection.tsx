import { useState } from 'react';
import { Comment } from '@/types/data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageSquarePlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Comments & Audit Trail</h3>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Add Comment
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="p-4">
          <Textarea
            placeholder="Enter your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3"
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewComment('');
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{comment.user}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground">{comment.text}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No comments yet</p>
      )}
    </div>
  );
}
