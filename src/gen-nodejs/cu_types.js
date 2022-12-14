//
// Autogenerated by Thrift Compiler (0.17.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;
var Int64 = require('node-int64');


var ttypes = module.exports = {};
ttypes.Error = {
  'NONE' : 0
};
var ReqPlayerRequest = module.exports.ReqPlayerRequest = function(args) {
  this.type = null;
  this.data = null;
  if (args) {
    if (args.type !== undefined && args.type !== null) {
      this.type = args.type;
    }
    if (args.data !== undefined && args.data !== null) {
      this.data = args.data;
    }
  }
};
ReqPlayerRequest.prototype = {};
ReqPlayerRequest.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.type = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.data = input.readBinary();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

ReqPlayerRequest.prototype.write = function(output) {
  output.writeStructBegin('ReqPlayerRequest');
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.STRING, 1);
    output.writeString(this.type);
    output.writeFieldEnd();
  }
  if (this.data !== null && this.data !== undefined) {
    output.writeFieldBegin('data', Thrift.Type.STRING, 2);
    output.writeBinary(this.data);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var RspPlayerRequest = module.exports.RspPlayerRequest = function(args) {
  this.result = null;
  this.type = null;
  this.data = null;
  if (args) {
    if (args.result !== undefined && args.result !== null) {
      this.result = args.result;
    }
    if (args.type !== undefined && args.type !== null) {
      this.type = args.type;
    }
    if (args.data !== undefined && args.data !== null) {
      this.data = args.data;
    }
  }
};
RspPlayerRequest.prototype = {};
RspPlayerRequest.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.result = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.type = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.data = input.readBinary();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

RspPlayerRequest.prototype.write = function(output) {
  output.writeStructBegin('RspPlayerRequest');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.I32, 1);
    output.writeI32(this.result);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.STRING, 2);
    output.writeString(this.type);
    output.writeFieldEnd();
  }
  if (this.data !== null && this.data !== undefined) {
    output.writeFieldBegin('data', Thrift.Type.STRING, 3);
    output.writeBinary(this.data);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var RspGroupListenerRegister = module.exports.RspGroupListenerRegister = function(args) {
  this.result = null;
  this.name = null;
  this.group = null;
  if (args) {
    if (args.result !== undefined && args.result !== null) {
      this.result = args.result;
    }
    if (args.name !== undefined && args.name !== null) {
      this.name = args.name;
    }
    if (args.group !== undefined && args.group !== null) {
      this.group = new ttypes.PayloadGroup(args.group);
    }
  }
};
RspGroupListenerRegister.prototype = {};
RspGroupListenerRegister.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.result = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.name = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRUCT) {
        this.group = new ttypes.PayloadGroup();
        this.group.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

RspGroupListenerRegister.prototype.write = function(output) {
  output.writeStructBegin('RspGroupListenerRegister');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.I32, 1);
    output.writeI32(this.result);
    output.writeFieldEnd();
  }
  if (this.name !== null && this.name !== undefined) {
    output.writeFieldBegin('name', Thrift.Type.STRING, 2);
    output.writeString(this.name);
    output.writeFieldEnd();
  }
  if (this.group !== null && this.group !== undefined) {
    output.writeFieldBegin('group', Thrift.Type.STRUCT, 3);
    this.group.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var MsgGroupUpdate = module.exports.MsgGroupUpdate = function(args) {
  this.name = null;
  this.group = null;
  if (args) {
    if (args.name !== undefined && args.name !== null) {
      this.name = args.name;
    }
    if (args.group !== undefined && args.group !== null) {
      this.group = new ttypes.PayloadGroup(args.group);
    }
  }
};
MsgGroupUpdate.prototype = {};
MsgGroupUpdate.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.name = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRUCT) {
        this.group = new ttypes.PayloadGroup();
        this.group.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

MsgGroupUpdate.prototype.write = function(output) {
  output.writeStructBegin('MsgGroupUpdate');
  if (this.name !== null && this.name !== undefined) {
    output.writeFieldBegin('name', Thrift.Type.STRING, 1);
    output.writeString(this.name);
    output.writeFieldEnd();
  }
  if (this.group !== null && this.group !== undefined) {
    output.writeFieldBegin('group', Thrift.Type.STRUCT, 2);
    this.group.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var PayloadGroup = module.exports.PayloadGroup = function(args) {
  this.base = null;
  this.props = null;
  if (args) {
    if (args.base !== undefined && args.base !== null) {
      this.base = new ttypes.InfoGroup(args.base);
    }
    if (args.props !== undefined && args.props !== null) {
      this.props = args.props;
    }
  }
};
PayloadGroup.prototype = {};
PayloadGroup.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.base = new ttypes.InfoGroup();
        this.base.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.props = input.readBinary();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

PayloadGroup.prototype.write = function(output) {
  output.writeStructBegin('PayloadGroup');
  if (this.base !== null && this.base !== undefined) {
    output.writeFieldBegin('base', Thrift.Type.STRUCT, 1);
    this.base.write(output);
    output.writeFieldEnd();
  }
  if (this.props !== null && this.props !== undefined) {
    output.writeFieldBegin('props', Thrift.Type.STRING, 2);
    output.writeBinary(this.props);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var InfoGroup = module.exports.InfoGroup = function(args) {
  this.id = null;
  this.type = null;
  if (args) {
    if (args.id !== undefined && args.id !== null) {
      this.id = args.id;
    }
    if (args.type !== undefined && args.type !== null) {
      this.type = args.type;
    }
  }
};
InfoGroup.prototype = {};
InfoGroup.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.id = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.type = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

InfoGroup.prototype.write = function(output) {
  output.writeStructBegin('InfoGroup');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.STRING, 1);
    output.writeString(this.id);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.STRING, 4);
    output.writeString(this.type);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

