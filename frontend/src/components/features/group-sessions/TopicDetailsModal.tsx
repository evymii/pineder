import React from "react";
import {
  Target,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  User,
  Star,
  Video,
  Copy,
  ExternalLink,
  X,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../design/system/dialog";

interface Topic {
  id: string;
  topic: string;
  description: string;
  studentName: string;
  category: string;
  difficulty: string;
  status: string;
  submittedAt: string;
  studentImage?: string;
  studentLevel?: string;
  grade?: string;
  interests?: string;
}

interface TopicDetailsModalProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (topicId: string, voteType: "upvote" | "downvote") => void;
  getVoteCount: (topicId: string, voteType: "upvote" | "downvote") => number;
  getMentorImage: (id: string) => string;
}

export const TopicDetailsModal: React.FC<TopicDetailsModalProps> = ({
  topic,
  isOpen,
  onClose,
  onVote,
  getVoteCount,
  getMentorImage,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getZoomInfo = (topicId: string) => {
    const zoomData = {
      "1": {
        link: "https://zoom.us/j/123456789?pwd=abcdef123456",
        code: "123456789",
        password: "abcdef123456",
        meetingId: "123 456 789",
        passcode: "abcdef123456",
      },
      "2": {
        link: "https://zoom.us/j/987654321?pwd=zyxwvu654321",
        code: "987654321",
        password: "zyxwvu654321",
        meetingId: "987 654 321",
        passcode: "zyxwvu654321",
      },
      "3": {
        link: "https://zoom.us/j/456789123?pwd=mnopqr789123",
        code: "456789123",
        password: "mnopqr789123",
        meetingId: "456 789 123",
        passcode: "mnopqr789123",
      },
    };
    return zoomData[topicId as keyof typeof zoomData] || zoomData["1"];
  };

  const handleVote = (topicId: string, voteType: "upvote" | "downvote") => {
    onVote(topicId, voteType);
    onClose();
  };

  if (!topic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-xl bg-white rounded-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              Topic Details
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 h-10 w-10 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Topic Header */}
          <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <img
              src={topic.studentImage || getMentorImage(topic.id)}
              alt={`${topic.studentName}'s profile`}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {topic.topic}
              </h3>
              <p className="text-lg text-gray-600 font-medium mb-3">
                {topic.studentName}
              </p>
            </div>
          </div>

          {/* Zoom Meeting Information */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <span>Zoom Meeting Details</span>
            </h4>

            {(() => {
              const zoomInfo = getZoomInfo(topic.id);
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Meeting Link */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Meeting Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={zoomInfo.link}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(zoomInfo.link)}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => window.open(zoomInfo.link, "_blank")}
                        className="px-4 py-3 bg-[#58CC02] hover:bg-[#46A302] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Meeting ID */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Meeting ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={zoomInfo.meetingId}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(zoomInfo.meetingId)}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Passcode */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Passcode
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={zoomInfo.passcode}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(zoomInfo.passcode)}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Direct Code */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Direct Code
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={zoomInfo.code}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(zoomInfo.code)}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <span>Additional Information</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Category
                </label>
                <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-200">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-semibold">
                    {topic.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Difficulty
                </label>
                <div className="flex items-center space-x-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all duration-200">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800 font-semibold capitalize">
                    {topic.difficulty}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Status
                </label>
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-semibold capitalize">
                    {topic.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Total Votes
                </label>
                <div className="flex items-center space-x-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all duration-200">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-bold text-lg">
                    {getVoteCount(topic.id, "upvote") -
                      getVoteCount(topic.id, "downvote")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Button
              onClick={() => handleVote(topic.id, "upvote")}
              className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              <ThumbsUp className="w-5 h-5 mr-2" />
              Vote Up
            </Button>
            <Button
              onClick={() => handleVote(topic.id, "downvote")}
              variant="outline"
              className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 py-4 rounded-xl font-bold transition-all duration-200 text-lg"
            >
              <ThumbsDown className="w-5 h-5 mr-2" />
              Vote Down
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
